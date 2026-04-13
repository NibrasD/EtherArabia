import { supabase, SUPABASE_URL } from './db';


export class FundingService {
    
    async fundNewUser(walletAddress: string): Promise<{
        success: boolean;
        txHash?: string;
        alreadyFunded?: boolean;
        message: string;
    }> {
        try {
            console.log('🔄 Requesting funding for wallet:', walletAddress);

            
            const { data: { session } } = await supabase.auth.getSession();

            const anonKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || '';

            const response = await fetch(`${SUPABASE_URL}/functions/v1/fund-new-user`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session?.access_token || anonKey}`,
                },
                body: JSON.stringify({ walletAddress }),
            });

            const data = await response.json();

            if (!response.ok) {
                console.error('❌ Funding request failed:', data);
                return {
                    success: false,
                    message: data.error || 'فشل شحن المحفظة',
                };
            }

            if (data.alreadyFunded) {
                console.log('ℹ️ Wallet already funded');
                return {
                    success: true,
                    alreadyFunded: true,
                    message: 'المحفظة مشحونة بالفعل',
                };
            }

            console.log('✅ Wallet funded successfully! TX:', data.txHash);
            return {
                success: true,
                txHash: data.txHash,
                message: `تم شحن محفظتك بنجاح بمبلغ ${data.amount} ETH`,
            };

        } catch (error: any) {
            console.error('❌ Funding error:', error);
            return {
                success: false,
                message: error.message || 'فشل الاتصال بخدمة الشحن',
            };
        }
    }

    
    async isWalletFunded(walletAddress: string): Promise<boolean> {
        try {
            const { data } = await supabase
                .from('funded_wallets')
                .select('id')
                .eq('wallet_address', walletAddress.toLowerCase())
                .maybeSingle();

            return !!data;
        } catch {
            return false;
        }
    }
}

export const fundingService = new FundingService();
