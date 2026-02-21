import React, { useState, useEffect } from 'react';
import { ArticleService } from '../services/db';
import { Article } from '../types';
import { Plus, Edit2, Trash2, Save, X, Eye, Image as ImageIcon, Layout, Type, FileText } from 'lucide-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const AdminDashboard: React.FC = () => {
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingArticle, setEditingArticle] = useState<Partial<Article> | null>(null);
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        loadArticles();
    }, []);

    const loadArticles = async () => {
        try {
            setLoading(true);
            const data = await ArticleService.getArticles();
            setArticles(data);
        } catch (error) {
            console.error('Error loading articles:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingArticle) return;

        try {
            const slug = editingArticle.title?.toLowerCase().replace(/\s+/g, '-').replace(/[^\u0600-\u06FFa-z0-9-]/g, '');
            const articleData = {
                ...editingArticle,
                slug: slug || '',
                author: 'Admin',
            } as Omit<Article, 'id' | 'created_at'>;

            if (editingArticle.id) {
                await ArticleService.updateArticle(editingArticle.id, articleData);
            } else {
                await ArticleService.addArticle(articleData);
            }
            setShowForm(false);
            setEditingArticle(null);
            loadArticles();
        } catch (error) {
            console.error('Error saving article:', error);
            alert('حدث خطأ أثناء حفظ المقال');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('هل أنت متأكد من حذف هذا المقال؟')) return;
        try {
            await ArticleService.deleteArticle(id);
            loadArticles();
        } catch (error) {
            console.error('Error deleting article:', error);
        }
    };

    const modules = {
        toolbar: [
            [{ 'header': [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            ['link', 'image', 'video'],
            ['clean'],
            [{ 'direction': 'rtl' }, { 'align': [] }],
        ],
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F3B011]"></div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto p-6 text-right" dir="rtl">
            <div className="flex justify-between items-center mb-12">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">لوحة التحكم</h1>
                    <p className="text-gray-400">إدارة المقالات التعليمية والمحتوى</p>
                </div>
                <button
                    onClick={() => {
                        setEditingArticle({ title: '', excerpt: '', content: '', thumbnail: '', category: 'تعليم' });
                        setShowForm(true);
                    }}
                    className="bg-[#F3B011] hover:bg-[#d99d0f] text-black font-bold py-3 px-6 rounded-2xl flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(243,176,17,0.3)]"
                >
                    <Plus size={20} />
                    إضافة مقال جديد
                </button>
            </div>

            {showForm && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
                    <div className="bg-[#1A1A1A] border border-white/10 rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto p-8 shadow-2xl">
                        <div className="flex justify-between items-center mb-8 pb-4 border-b border-white/10">
                            <h2 className="text-2xl font-bold text-white">
                                {editingArticle?.id ? 'تعديل مقال' : 'إضافة مقال جديد'}
                            </h2>
                            <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-white transition-colors">
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSave} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm text-gray-400 flex items-center gap-2">
                                        <Type size={16} /> عنوان المقال
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={editingArticle?.title}
                                        onChange={e => setEditingArticle({ ...editingArticle, title: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-[#F3B011] outline-none"
                                        placeholder="أدخل عنواناً جذاباً..."
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm text-gray-400 flex items-center gap-2">
                                        <Layout size={16} /> التصنيف
                                    </label>
                                    <select
                                        value={editingArticle?.category}
                                        onChange={e => setEditingArticle({ ...editingArticle, category: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-[#F3B011] outline-none"
                                    >
                                        <option value="تعليم">تعليم</option>
                                        <option value="تقنية">تقنية</option>
                                        <option value="أخبار">أخبار</option>
                                        <option value="خصوصية">خصوصية</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm text-gray-400 flex items-center gap-2">
                                    <ImageIcon size={16} /> رابط الصورة المصغرة
                                </label>
                                <input
                                    type="url"
                                    required
                                    value={editingArticle?.thumbnail}
                                    onChange={e => setEditingArticle({ ...editingArticle, thumbnail: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-[#F3B011] outline-none"
                                    placeholder="https://example.com/image.jpg"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm text-gray-400 flex items-center gap-2">
                                    <FileText size={16} /> وصف مختصر (مقتطف)
                                </label>
                                <textarea
                                    required
                                    value={editingArticle?.excerpt}
                                    onChange={e => setEditingArticle({ ...editingArticle, excerpt: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-[#F3B011] outline-none h-24"
                                    placeholder="اكتب وصفاً قصيراً يظهر في القائمة..."
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm text-gray-400 mb-2 block">محتوى المقال</label>
                                <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden min-h-[400px]">
                                    <ReactQuill
                                        theme="snow"
                                        value={editingArticle?.content}
                                        onChange={content => setEditingArticle({ ...editingArticle, content })}
                                        modules={modules}
                                        className="h-[350px] text-white"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end gap-4 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowForm(false)}
                                    className="px-6 py-3 rounded-xl border border-white/10 text-gray-400 hover:text-white transition-colors"
                                >
                                    إلغاء
                                </button>
                                <button
                                    type="submit"
                                    className="bg-[#F3B011] text-black font-bold px-10 py-3 rounded-xl flex items-center gap-2 hover:bg-[#d99d0f] transition-all"
                                >
                                    <Save size={20} />
                                    حفظ المقال
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 gap-4">
                {articles.map(article => (
                    <div
                        key={article.id}
                        className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col md:flex-row items-center gap-6 hover:border-white/20 transition-all"
                    >
                        <img
                            src={article.thumbnail}
                            alt={article.title}
                            className="w-32 h-20 object-cover rounded-xl shadow-lg"
                        />
                        <div className="flex-1 text-right">
                            <h3 className="text-xl font-bold text-white mb-1">{article.title}</h3>
                            <div className="flex gap-4 items-center">
                                <span className="text-[#F3B011] text-sm">{article.category}</span>
                                <span className="text-gray-500 text-xs">
                                    {new Date(article.created_at).toLocaleDateString('ar-SA')}
                                </span>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => {
                                    setEditingArticle(article);
                                    setShowForm(true);
                                }}
                                className="p-3 rounded-xl bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white transition-all"
                                title="تعديل"
                            >
                                <Edit2 size={20} />
                            </button>
                            <button
                                onClick={() => handleDelete(article.id)}
                                className="p-3 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all"
                                title="حذف"
                            >
                                <Trash2 size={20} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {articles.length === 0 && (
                <div className="text-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/10">
                    <p className="text-gray-500">لا توجد مقالات حالياً</p>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
