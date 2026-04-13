import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.8";

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req: Request) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders });
    }

    try {
        const { walletAddress } = await req.json();

        if (!walletAddress || typeof walletAddress !== 'string') {
            throw new Error('Invalid wallet address provided');
        }

        
        const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
        const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
        const supabase = createClient(supabaseUrl, supabaseServiceKey);

        
        const { data: existingRecord } = await supabase
            .from('funded_wallets')
            .select('wallet_address')
            .eq('wallet_address', walletAddress.toLowerCase())
            .maybeSingle();

        if (existingRecord) {
            return new Response(
                JSON.stringify({ error: "Certificate already minted for this wallet" }),
                { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
        }

        
        const engineUrl = Deno.env.get('THIRDWEB_ENGINE_URL') || 'https://api.thirdweb.com/v1';
        const secretKey = Deno.env.get('THIRDWEB_SECRET_KEY');
        const contractAddress = Deno.env.get('CONTRACT_ADDRESS') || '0x6b634a14e14c2565616fa68073011228c6da3de5';
        const chainId = Deno.env.get('CHAIN_ID') || '1'; 

        if (!secretKey) {
            throw new Error('THIRDWEB_SECRET_KEY is missing in environment variables');
        }

        console.log(`--- Requesting Mint via Thirdweb Engine for: ${walletAddress} ---`);

        
        const response = await fetch(`${engineUrl.replace(/\/$/, '')}/contracts/write`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-secret-key': secretKey,
            },
            body: JSON.stringify({
                chainId: chainId,
                calls: [{
                    contractAddress: contractAddress,
                    method: "function mintTo(address to, string memory uri)",
                    params: [
                        walletAddress,
                        "https://etherarabia.com/metadata/achievement-1.json" 
                    ],
                }]
            }),
        });

        const result = await response.json();

        if (!response.ok) {
            console.error('Engine Error:', result);
            throw new Error(result.error?.message || 'Failed to trigger minting via Engine');
        }

        const transactionId = result.result.queueId || result.result.transactionHash;

        
        await supabase
            .from('funded_wallets')
            .insert([{
                wallet_address: walletAddress.toLowerCase(),
                transaction_hash: transactionId,
                funded_at: new Date().toISOString()
            }]);

        return new Response(
            JSON.stringify({
                success: true,
                transactionId: transactionId,
                message: "Minting request queued successfully"
            }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
        );

    } catch (error: any) {
        console.error("Minting Error:", error);
        return new Response(
            JSON.stringify({ error: error.message }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
        );
    }
});
