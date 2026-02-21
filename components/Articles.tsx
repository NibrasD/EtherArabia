import React, { useState, useEffect } from 'react';
import { ArticleService } from '../services/db';
import { Article } from '../types';
import { Search, BookOpen, Clock, ChevronRight, ArrowRight } from 'lucide-react';

const Articles: React.FC = () => {
    const [articles, setArticles] = useState<Article[]>([]);
    const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);
    const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadArticles();
    }, []);

    useEffect(() => {
        const filtered = articles.filter(a =>
            a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            a.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
            a.category.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredArticles(filtered);
    }, [searchQuery, articles]);

    const loadArticles = async () => {
        try {
            setLoading(true);
            const data = await ArticleService.getArticles();
            setArticles(data);
            setFilteredArticles(data);
        } catch (error) {
            console.error('Error loading articles:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F3B011]"></div>
            </div>
        );
    }

    if (selectedArticle) {
        return (
            <div className="max-w-4xl mx-auto p-6 animate-fade-in text-right" dir="rtl">
                <button
                    onClick={() => setSelectedArticle(null)}
                    className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors"
                >
                    <ArrowRight size={20} />
                    <span>العودة للمقالات</span>
                </button>

                <img
                    src={selectedArticle.thumbnail}
                    alt={selectedArticle.title}
                    className="w-full h-[400px] object-cover rounded-3xl mb-8 shadow-2xl"
                />

                <div className="flex gap-4 mb-4">
                    <span className="px-4 py-1 rounded-full bg-[#F3B011]/10 text-[#F3B011] text-sm">
                        {selectedArticle.category}
                    </span>
                    <span className="text-gray-400 text-sm flex items-center gap-1">
                        <Clock size={14} />
                        {new Date(selectedArticle.created_at).toLocaleDateString('ar-SA')}
                    </span>
                </div>

                <h1 className="text-4xl font-bold text-white mb-6 leading-tight">
                    {selectedArticle.title}
                </h1>

                <div
                    className="prose prose-invert prose-yellow max-w-none text-gray-300 leading-relaxed text-lg"
                    dangerouslySetInnerHTML={{ __html: selectedArticle.content }}
                />
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto p-6" dir="rtl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                <div>
                    <h1 className="text-4xl font-bold text-white mb-2">المقالات التعليمية</h1>
                    <p className="text-gray-400">اكتشف كل ما هو جديد في عالم Zcash والخصوصية الرقمية</p>
                </div>

                <div className="relative">
                    <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="ابحث عن مقال..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="bg-white/5 border border-white/10 rounded-2xl py-3 pr-12 pl-4 text-white focus:outline-none focus:ring-2 focus:ring-[#F3B011]/50 w-full md:w-[300px] transition-all"
                    />
                </div>
            </div>

            {filteredArticles.length === 0 ? (
                <div className="text-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/10">
                    <BookOpen size={48} className="mx-auto text-gray-500 mb-4" />
                    <p className="text-gray-400 text-xl">لم يتم العثور على مقالات تطابق بحثك</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredArticles.map((article) => (
                        <div
                            key={article.id}
                            className="group bg-white/5 border border-white/10 rounded-3xl overflow-hidden hover:border-[#F3B011]/30 transition-all hover:translate-y-[-4px] cursor-pointer"
                            onClick={() => setSelectedArticle(article)}
                        >
                            <div className="aspect-video overflow-hidden">
                                <img
                                    src={article.thumbnail}
                                    alt={article.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                            </div>
                            <div className="p-6 text-right">
                                <span className="text-sm text-[#F3B011] bg-[#F3B011]/10 px-3 py-1 rounded-full mb-3 inline-block">
                                    {article.category}
                                </span>
                                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-[#F3B011] transition-colors line-clamp-2">
                                    {article.title}
                                </h3>
                                <p className="text-gray-400 text-sm line-clamp-3 mb-6">
                                    {article.excerpt}
                                </p>
                                <div className="flex items-center justify-between pt-6 border-t border-white/10">
                                    <span className="text-xs text-gray-500 flex items-center gap-1">
                                        <Clock size={12} />
                                        {new Date(article.created_at).toLocaleDateString('ar-SA')}
                                    </span>
                                    <button className="text-[#F3B011] text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                                        اقرأ المزيد
                                        <ChevronRight size={16} className="rotate-180" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Articles;
