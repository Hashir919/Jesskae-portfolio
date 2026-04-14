import { motion, AnimatePresence } from "motion/react";
import { 
  Sparkles, 
  Github, 
  Twitter, 
  Instagram,
  Send,
  ArrowRight,
  Plus,
  Trash2,
  LogOut,
  Settings,
  Image as ImageIcon,
  Save,
  Loader2,
  Menu,
  X,
  LayoutDashboard,
  User,
  MessageSquare,
  ChevronRight,
  Upload,
  Globe,
  Mail,
  Smartphone
} from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { Routes, Route, Link, useNavigate, useLocation } from "react-router-dom";
import { supabase } from "./supabaseClient";

// --- Cloudinary Config ---
const CLOUDINARY_UPLOAD_PRESET = "jesskae";
const CLOUDINARY_CLOUD_NAME = "dib3jrmql";
const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

// --- Constants & Defaults ---
const DEFAULT_SITE_CONTENT = {
  hero_title: "PORTFOLIO",
  hero_subtitle: "Anime Artist & Designer",
  about_title: "About Jesskae",
  about_text_1: "Hello! I'm Jesskae, a digital artist dedicated to the world of contemporary anime illustration.",
  about_text_2: "With a focus on creating dreamy visual experiences, I blend futuristic aesthetics with cozy, nostalgic vibes.",
  about_image_url: "",
  about_page_title: "My Creative Journey",
  about_page_content: "Drawing inspiration from early 2000s anime and futuristic cyberpunk aesthetics...",
  contact_tagline: "Interested in a commission or just want to say hi?",
  contact_email: "hello@jesskae.art",
  social_twitter: "@jesskae",
  social_instagram: "@jesskae.art",
  social_discord: "jesskae#0000",
  footer_text: "Digital artist based in dreamworlds.",
  year: "2026"
};

// --- Helpers ---
const useContent = () => {
    const [content, setContent] = useState<any>(DEFAULT_SITE_CONTENT);
    const [artworks, setArtworks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        setLoading(true);
        const { data: arts } = await supabase.from('artworks').select('*').order('created_at', { ascending: false });
        const { data: settings } = await supabase.from('site_settings').select('*');
        if (arts) setArtworks(arts);
        if (settings) {
            const mapped = settings.reduce((acc: any, curr: any) => { acc[curr.key] = curr.value; return acc; }, {});
            setContent({ ...DEFAULT_SITE_CONTENT, ...mapped });
        }
        setLoading(false);
    };

    useEffect(() => { fetchData(); }, []);

    return { content, artworks, loading, refresh: fetchData };
};

const uploadToCloudinary = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
    
    const response = await fetch(CLOUDINARY_URL, {
        method: "POST",
        body: formData,
    });
    
    if (!response.ok) throw new Error("Upload failed");
    const data = await response.json();
    return data.secure_url;
};

// --- Components ---

const Navbar = () => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');
  if (isAdmin) return null;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-8 sm:px-12 py-8 pointer-events-auto">
      <Link to="/" className="flex items-center gap-4 group">
        <span className="font-display font-black text-2xl tracking-tighter text-slate-900/20 uppercase group-hover:text-pink-deep/40 transition-colors">
          Jesskae
        </span>
      </Link>
      
      <div className="flex items-center gap-10 font-display text-[10px] font-bold text-slate-400 tracking-widest uppercase">
         <Link to="/" className="hover:text-pink-deep transition-colors">Home</Link>
         <Link to="/portfolio" className="hover:text-pink-deep transition-colors">Portfolio</Link>
         <Link to="/about" className="hover:text-pink-deep transition-colors">About</Link>
         <Link to="/contact" className="hover:text-pink-deep transition-colors">Contact</Link>
      </div>
    </nav>
  );
};

const Footer = ({ content }: any) => {
  const location = useLocation();
  if (location.pathname.startsWith('/admin')) return null;

  return (
    <footer className="py-20 px-12 border-t border-slate-900/5 bg-pastel-pink/10">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12 sm:text-center">
        <div className="flex flex-col md:items-start gap-4">
          <span className="font-display font-black text-3xl tracking-tighter text-slate-900/10 uppercase">Jesskae</span>
          <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">{content.footer_text}</p>
        </div>
        <div className="flex gap-12 text-[10px] font-bold text-slate-400 tracking-widest uppercase items-center">
          <Link to="/" className="hover:text-pink-deep transition-colors">Home</Link>
          <Link to="/portfolio" className="hover:text-pink-deep transition-colors">Gallery</Link>
          <Link to="/admin" className="text-slate-100 hover:text-slate-300">Admin</Link>
        </div>
        <div className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">© {content.year} JESSKAE</div>
      </div>
    </footer>
  );
};

// --- Page: Home ---
const HomePage = ({ artworks, content }: any) => {
  const featured = artworks.filter((a: any) => a.is_featured).slice(0, 4);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      {/* Hero */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center z-10">
          <span className="font-display font-bold text-pink-deep/60 uppercase tracking-[0.4em] text-[10px] mb-8 block">{content.hero_subtitle}</span>
          <h1 className="font-display text-[15vw] md:text-[11vw] font-black leading-none holo-text text-tight pointer-events-none">{content.hero_title}</h1>
          <div className="mt-12 flex justify-center items-center gap-4 text-[10px] font-bold text-slate-400 tracking-[0.3em]">
            <span>EST. 2018</span>
            <div className="w-1.5 h-1.5 rounded-full bg-pink-soft/40" />
            <span>{content.year}</span>
          </div>
        </motion.div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vw] h-[70vw] bg-pink-soft/10 rounded-full blur-[180px] -z-10" />
      </section>

      {/* About Section */}
      <section className="py-32 px-6 max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-24 items-center">
          <div className="order-2 lg:order-1">
             <div className="aspect-[4/5] rounded-[3rem] glossy-blob overflow-hidden bg-slate-50 relative flex items-center justify-center group shadow-2xl">
                {content.about_image_url ? (
                  <img src={content.about_image_url} className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-105" alt="About Jesskae" />
                ) : (
                  <Sparkles className="w-24 h-24 text-pink-soft opacity-20" />
                )}
             </div>
          </div>
          <div className="order-1 lg:order-2">
            <span className="text-pink-deep/60 font-bold text-xs uppercase tracking-widest mb-6 block">Introduction</span>
            <h2 className="font-display text-5xl font-black text-slate-900 mb-8 tracking-tighter leading-tight">{content.about_title}</h2>
            <p className="text-slate-500 text-lg leading-relaxed font-medium mb-8">{content.about_text_1}</p>
            <Link to="/about" className="inline-flex items-center gap-4 font-display font-black text-xs uppercase tracking-widest text-slate-900 hover:text-pink-deep group">
              Read My Story <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Portfolio */}
      <section className="py-32 px-6 max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-16 px-4">
          <h2 className="font-display text-6xl font-black text-slate-900 tracking-tighter italic">Gallery</h2>
          <Link to="/portfolio" className="flex items-center gap-3 font-display font-black text-xs uppercase tracking-widest text-slate-400 hover:text-pink-deep group">View All <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" /></Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {(featured.length > 0 ? featured : artworks.slice(0, 4)).map((art: any) => (
            <motion.div key={art.id} whileHover={{ y: -10 }} className="group relative h-[600px] overflow-hidden rounded-[2.5rem] bg-white shadow-xl shadow-pink-100/20 cursor-pointer">
              <img src={art.image_url} alt={art.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2s]" />
              <div className="absolute inset-0 bg-gradient-to-t from-pink-deep/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700 p-12 flex flex-col justify-end">
                <h4 className="font-display font-black text-4xl text-white mb-2">{art.title}</h4>
                <div className="flex gap-3">
                   <span className="px-4 py-1.5 rounded-full glass text-[10px] text-white font-bold uppercase tracking-widest">{art.type}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Quick Contact */}
      <section className="py-32 px-6 max-w-4xl mx-auto">
         <div className="glass rounded-[4rem] p-20 text-center relative overflow-hidden">
            <h2 className="font-display text-5xl font-black text-slate-900 mb-8 tracking-tighter">Stay Connected</h2>
            <p className="text-slate-500 font-medium text-lg mb-12 max-w-md mx-auto">{content.contact_tagline}</p>
            <div className="flex flex-wrap justify-center gap-6">
                <a href={`mailto:${content.contact_email}`} className="bg-slate-900 text-white px-12 py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-pink-deep transition-all flex items-center gap-3"><Mail className="w-4 h-4" /> Email</a>
                <Link to="/contact" className="glass px-12 py-5 rounded-2xl font-black text-xs uppercase tracking-widest text-slate-900 hover:bg-white transition-all">All Socials</Link>
            </div>
         </div>
      </section>
    </motion.div>
  );
};

// --- Page: About ---
const AboutPage = ({ content }: any) => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pt-40 pb-32 px-6 max-w-4xl mx-auto">
    <div className="text-center mb-24">
       <span className="text-pink-deep font-bold text-xs uppercase tracking-widest mb-4 block">Artist Profile</span>
       <h2 className="font-display text-7xl font-black text-slate-900 tracking-tighter mb-8 leading-[0.9]">{content.about_page_title}</h2>
    </div>
    <div className="grid gap-12 text-slate-600 text-xl font-medium leading-relaxed">
       <div className="glass p-12 rounded-[3.5rem] border-pink-soft/20 overflow-hidden relative">
          <div className="grid md:grid-cols-[1fr_2fr] gap-10 items-center">
             <div className="aspect-[3/4] rounded-3xl overflow-hidden bg-slate-50">
                {content.about_image_url && <img src={content.about_image_url} className="w-full h-full object-cover" />}
             </div>
             <div>
                <p className="mb-10 text-slate-900 text-2xl font-bold leading-snug">"{content.about_text_1}"</p>
                <p>{content.about_text_2}</p>
             </div>
          </div>
       </div>
       <div className="p-4">
          <h3 className="font-display text-3xl font-black text-slate-900 mb-6 tracking-tight">The Vision</h3>
          <p>{content.about_page_content}</p>
       </div>
    </div>
  </motion.div>
);

// --- Page: Contact ---
const ContactPage = ({ content }: any) => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pt-40 pb-32 px-6 max-w-5xl mx-auto">
    <div className="grid lg:grid-cols-2 gap-20 items-center">
       <div>
          <h2 className="font-display text-7xl font-black text-slate-900 tracking-tighter mb-10 leading-[0.9]">Let's <span className="holo-text">Talk</span></h2>
          <p className="text-slate-500 text-xl font-medium mb-12">{content.contact_tagline}</p>
          
          <div className="space-y-6">
             <div className="flex items-center gap-6 group cursor-pointer">
                <div className="w-14 h-14 rounded-2xl glass flex items-center justify-center text-pink-deep group-hover:bg-pink-deep group-hover:text-white transition-all"><Mail className="w-6 h-6" /></div>
                <div><p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Email</p><p className="text-xl font-black text-slate-900">{content.contact_email}</p></div>
             </div>
             <div className="flex items-center gap-6 group cursor-pointer">
                <div className="w-14 h-14 rounded-2xl glass flex items-center justify-center text-pink-deep group-hover:bg-pink-deep group-hover:text-white transition-all"><Twitter className="w-6 h-6" /></div>
                <div><p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Twitter</p><p className="text-xl font-black text-slate-900">{content.social_twitter}</p></div>
             </div>
             <div className="flex items-center gap-6 group cursor-pointer">
                <div className="w-14 h-14 rounded-2xl glass flex items-center justify-center text-pink-deep group-hover:bg-pink-deep group-hover:text-white transition-all"><Instagram className="w-6 h-6" /></div>
                <div><p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Instagram</p><p className="text-xl font-black text-slate-900">{content.social_instagram}</p></div>
             </div>
          </div>
       </div>
       <div className="glass p-12 rounded-[3.5rem] relative">
          <form className="space-y-6">
             <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-4">Full Name</label>
                <input className="w-full px-8 py-5 rounded-2xl bg-white/50 border border-slate-100 font-medium focus:ring-4 focus:ring-pink-soft/10 outline-none transition-all" placeholder="Enter your name" />
             </div>
             <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-4">Email Address</label>
                <input className="w-full px-8 py-5 rounded-2xl bg-white/50 border border-slate-100 font-medium focus:ring-4 focus:ring-pink-soft/10 outline-none transition-all" placeholder="Enter your email" />
             </div>
             <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-4">Message</label>
                <textarea rows={4} className="w-full px-8 py-5 rounded-2xl bg-white/50 border border-slate-100 font-medium focus:ring-4 focus:ring-pink-soft/10 outline-none transition-all" placeholder="What's on your mind?" />
             </div>
             <button className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-pink-deep shadow-xl shadow-slate-200 flex items-center justify-center gap-3">Send Message <Send className="w-4 h-4" /></button>
          </form>
       </div>
    </div>
  </motion.div>
);

// --- Page: Portfolio Gallery ---
const PortfolioGallery = ({ artworks }: any) => {
  const [filter, setFilter] = useState("All");
  const filtered = filter === "All" ? artworks : artworks.filter((a: any) => a.type === filter);
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pt-40 pb-32 px-6 max-w-7xl mx-auto">
       <div className="mb-20 text-center">
          <h2 className="font-display text-8xl font-black text-slate-900 tracking-tighter mb-12">Archive</h2>
          <div className="flex flex-wrap justify-center gap-3">
             {["All", "Illustration", "Character", "Sketches"].map(f => (
                <button key={f} onClick={() => setFilter(f)} className={`px-10 py-4 rounded-full font-display font-black text-xs uppercase tracking-widest transition-all ${filter === f ? 'bg-slate-900 text-white shadow-xl scale-105' : 'glass text-slate-400 hover:text-slate-900'}`}>{f}</button>
             ))}
          </div>
       </div>
       <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {filtered.map((art: any) => (
             <motion.div key={art.id} layout className="group aspect-square rounded-[2.5rem] overflow-hidden bg-white shadow-lg relative cursor-zoom-in">
                <img src={art.image_url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1.5s]" />
                <div className="absolute inset-0 bg-pink-deep/20 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
             </motion.div>
          ))}
       </div>
    </motion.div>
  );
};

// --- Admin Section Components ---

const AdminSidebar = ({ active, setTab, onLogout }: any) => (
    <aside className="w-80 bg-white/40 backdrop-blur-xl border-r border-slate-100 flex flex-col p-10 fixed left-0 top-0 bottom-0 z-50">
        <div className="mb-14">
            <span className="font-display font-black text-3xl tracking-tighter text-slate-900 uppercase">Jesskae</span>
            <p className="text-pink-deep text-[10px] font-black uppercase tracking-widest mt-1 ml-1 opacity-60">Admin CMS</p>
        </div>
        <nav className="flex-1 space-y-3 font-display">
            {[
                { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
                { id: 'portfolio', label: 'Portfolio', icon: ImageIcon },
                { id: 'about', label: 'Story & Bio', icon: User },
                { id: 'contact', label: 'Inquiry & Social', icon: MessageSquare },
                { id: 'settings', label: 'Globals', icon: Settings },
            ].map(tab => (
                <button 
                    key={tab.id} onClick={() => setTab(tab.id)}
                    className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all text-sm ${active === tab.id ? 'bg-slate-900 text-white shadow-2xl shadow-slate-900/20' : 'text-slate-400 hover:text-slate-900 hover:bg-white/60'}`}
                >
                    <tab.icon className="w-5 h-5" /> {tab.label}
                </button>
            ))}
        </nav>
        <button onClick={onLogout} className="mt-auto flex items-center gap-4 px-6 py-4 rounded-2xl font-bold text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all font-display">
            <LogOut className="w-5 h-5" /> Logout
        </button>
    </aside>
);

const AdminPage = ({ user, artworks, content, onRefresh }: any) => {
    const [tab, setTab] = useState("dashboard");
    const [edit, setEdit] = useState(content);
    const [saving, setSaving] = useState(false);
    const [modal, setModal] = useState(false);
    const [newItem, setNewItem] = useState({ title: "", type: "Illustration", image_url: "", is_featured: false });
    const [uploading, setUploading] = useState(false);
    const navigate = useNavigate();

    const saveChanges = async () => {
        setSaving(true);
        try {
            for (const [key, value] of Object.entries(edit)) {
                await supabase.from('site_settings').upsert({ key, value: String(value) });
            }
            onRefresh();
            alert("Changes published successfully!");
        } catch (err) { alert(err); }
        setSaving(false);
    };

    const handleCloudinaryUpload = async (file: File, isAbout: boolean = false) => {
        setUploading(true);
        try {
            const url = await uploadToCloudinary(file);
            if (isAbout) {
                setEdit({ ...edit, about_image_url: url });
            } else {
                setNewItem({ ...newItem, image_url: url });
            }
        } catch (err) {
            alert("Upload failed. please try again.");
        }
        setUploading(false);
    };

    const addArt = async (e: any) => {
        e.preventDefault();
        if (!newItem.image_url) return alert("Please upload an image first.");
        setSaving(true);
        const { error } = await supabase.from('artworks').insert([newItem]);
        if (error) alert(error.message);
        else {
            setModal(false);
            setNewItem({ title: "", type: "Illustration", image_url: "", is_featured: false });
            onRefresh();
        }
        setSaving(false);
    };

    if (!user) return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-[#FFF5F7]">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass p-12 rounded-[4rem] w-full max-w-md shadow-2xl text-center">
                <h2 className="font-display text-4xl font-black text-slate-900 mb-10 tracking-tighter">Portal Access</h2>
                <form onSubmit={async (e) => {
                    e.preventDefault();
                    setSaving(true);
                    const { error } = await supabase.auth.signInWithPassword({ email: (e.target as any).email.value, password: (e.target as any).password.value });
                    if (error) alert(error.message);
                    setSaving(false);
                }} className="space-y-4">
                    <input name="email" type="email" placeholder="Email" className="w-full px-8 py-5 rounded-2xl bg-white/50 border border-slate-100 font-medium" />
                    <input name="password" type="password" placeholder="Password" className="w-full px-8 py-5 rounded-2xl bg-white/50 border border-slate-100 font-medium" />
                    <button disabled={saving} className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-pink-deep transition-all">
                        {saving ? "Opening..." : "Login"}
                    </button>
                </form>
                <Link to="/" className="mt-8 block font-black text-[10px] uppercase tracking-widest text-slate-400 hover:text-slate-900">Cancel</Link>
            </motion.div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#FDF8F9] pl-80">
            <AdminSidebar active={tab} setTab={setTab} onLogout={async () => { await supabase.auth.signOut(); navigate("/"); }} />
            <main className="p-16 max-w-6xl">
                <header className="flex justify-between items-center mb-16">
                    <div>
                        <h2 className="font-display text-5xl font-black text-slate-900 tracking-tighter capitalize">{tab}</h2>
                        <p className="text-slate-400 font-medium mt-2">Manage your artist brand.</p>
                    </div>
                    {tab !== 'dashboard' && tab !== 'portfolio' && (
                        <button onClick={saveChanges} disabled={saving || uploading} className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-3 shadow-lg hover:bg-pink-deep transition-all disabled:opacity-50">
                            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} {uploading ? "Uploading..." : "Publish Changes"}
                        </button>
                    )}
                </header>

                {tab === 'dashboard' && (
                    <div className="grid grid-cols-3 gap-8">
                        <div className="glass p-10 rounded-[3rem] text-center border-none shadow-sm">
                            <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mb-4">Total Artworks</p>
                            <p className="text-6xl font-black text-slate-900">{artworks.length}</p>
                        </div>
                        <div className="glass p-10 rounded-[3rem] text-center border-none shadow-sm bg-white/60">
                            <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mb-4">Featured</p>
                            <p className="text-6xl font-black text-pink-deep">{artworks.filter(a => a.is_featured).length}</p>
                        </div>
                    </div>
                )}

                {tab === 'portfolio' && (
                    <div className="space-y-10">
                        <div className="flex justify-end"><button onClick={() => setModal(true)} className="bg-pink-deep text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-3 shadow-xl"><Plus className="w-4 h-4" /> Add Artwork</button></div>
                        <div className="grid grid-cols-1 gap-4">
                            {artworks.map((art: any) => (
                                <div key={art.id} className="flex items-center gap-6 p-5 glass rounded-3xl group border-transparent hover:border-pink-soft/30 transition-all">
                                    <img src={art.image_url} className="w-20 h-20 rounded-2xl object-cover shadow-lg" />
                                    <div className="flex-1">
                                        <p className="font-black text-slate-900 text-lg">{art.title}</p>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{art.type} {art.is_featured && '• Featured'}</p>
                                    </div>
                                    <button onClick={async () => { if(confirm("Delete?")) { await supabase.from('artworks').delete().eq('id', art.id); onRefresh(); } }} className="w-12 h-12 rounded-xl flex items-center justify-center text-slate-300 hover:text-red-500 hover:bg-red-50 transition-all font-display"><Trash2 className="w-5 h-5" /></button>
                                </div>
                            ))}
                        </div>

                        {modal && (
                            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-md">
                                <form onSubmit={addArt} className="bg-white p-12 rounded-[4rem] w-full max-w-2xl grid md:grid-cols-2 gap-10 relative border-none">
                                    <button type="button" onClick={() => setModal(false)} className="absolute top-10 right-10 text-slate-300 hover:text-slate-900"><X /></button>
                                    <div className="space-y-6">
                                        <h4 className="font-display text-4xl font-black tracking-tighter">New Piece</h4>
                                        <div className="space-y-2">
                                            <input placeholder="Artwork Title" required className="w-full px-6 py-4 rounded-xl border border-slate-100 bg-slate-50 font-medium" value={newItem.title} onChange={e => setNewItem({...newItem, title: e.target.value})} />
                                            <select className="w-full px-6 py-4 rounded-xl border border-slate-100 bg-slate-50 font-medium" value={newItem.type} onChange={e => setNewItem({...newItem, type: e.target.value})}>
                                                <option>Illustration</option><option>Character</option><option>Sketches</option>
                                            </select>
                                            <div className="relative group">
                                                <input type="file" accept="image/*" onChange={(e: any) => handleCloudinaryUpload(e.target.files[0])} className="hidden" id="art-upload" />
                                                <label htmlFor="art-upload" className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-xl border border-slate-100 bg-slate-50 font-bold text-slate-400 cursor-pointer hover:bg-slate-100 transition-all">
                                                    {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />} {newItem.image_url ? "Change Image" : "Select Image"}
                                                </label>
                                            </div>
                                            <label className="flex items-center gap-4 cursor-pointer text-sm font-bold text-slate-500 p-4"><input type="checkbox" checked={newItem.is_featured} onChange={e => setNewItem({...newItem, is_featured: e.target.checked})} /> Feature on Homepage Overlay</label>
                                        </div>
                                        <button disabled={saving || uploading} className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-pink-deep shadow-xl disabled:bg-slate-300">{uploading ? "Waiting for upload..." : "Create Piece"}</button>
                                    </div>
                                    <div className="flex items-center justify-center bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-slate-200 p-6 overflow-hidden min-h-[300px]">
                                        {newItem.image_url ? (
                                            <img src={newItem.image_url} className="w-full h-full object-cover rounded-2xl" />
                                        ) : (
                                            <div className="text-center text-slate-300"><ImageIcon className="w-12 h-12 mx-auto mb-4 opacity-10" /><p className="text-[10px] font-black uppercase tracking-widest">Image Preview</p></div>
                                        )}
                                    </div>
                                </form>
                            </div>
                        )}
                    </div>
                )}

                {tab === 'about' && (
                    <div className="grid md:grid-cols-[1fr_2fr] gap-12 glass p-12 rounded-[4rem] border-none">
                         <div className="space-y-6">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">About Profile Image</label>
                            <div className="aspect-[3/4] rounded-[2rem] bg-slate-50 relative group overflow-hidden border-2 border-dashed border-slate-100 flex items-center justify-center">
                                {edit.about_image_url ? (
                                    <img src={edit.about_image_url} className="w-full h-full object-cover" />
                                ) : (
                                    <User className="w-12 h-12 text-slate-200" />
                                )}
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <input type="file" accept="image/*" onChange={(e: any) => handleCloudinaryUpload(e.target.files[0], true)} className="hidden" id="about-upload" />
                                    <label htmlFor="about-upload" className="bg-white text-slate-900 px-6 py-3 rounded-full font-black text-[10px] uppercase tracking-widest cursor-pointer hover:bg-pink-soft">
                                        {uploading ? "Uploading..." : "Change Photo"}
                                    </label>
                                </div>
                            </div>
                         </div>
                         <div className="space-y-8">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Section Heading</label>
                                <input value={edit.about_title} onChange={e => setEdit({...edit, about_title: e.target.value})} className="w-full px-8 py-5 rounded-2xl bg-slate-50 border-transparent font-black text-2xl tracking-tighter focus:bg-white focus:ring-4 focus:ring-pink-soft/5 outline-none transition-all" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Tagline</label>
                                <textarea rows={3} value={edit.about_text_1} onChange={e => setEdit({...edit, about_text_1: e.target.value})} className="w-full px-8 py-5 rounded-2xl bg-slate-50 border-transparent font-medium text-lg leading-relaxed focus:bg-white focus:ring-4 focus:ring-pink-soft/5 outline-none transition-all" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Full Bio</label>
                                <textarea rows={6} value={edit.about_page_content} onChange={e => setEdit({...edit, about_page_content: e.target.value})} className="w-full px-8 py-5 rounded-2xl bg-slate-50 border-transparent font-medium text-lg leading-relaxed focus:bg-white focus:ring-4 focus:ring-pink-soft/5 outline-none transition-all" />
                            </div>
                         </div>
                    </div>
                )}

                {tab === 'contact' && (
                    <div className="grid md:grid-cols-2 gap-10">
                        <div className="glass p-12 rounded-[4rem] space-y-8 border-none">
                            <h4 className="font-display text-2xl font-black mb-4">Direct</h4>
                             <div className="space-y-4">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Email</label>
                                <input value={edit.contact_email} onChange={e => setEdit({...edit, contact_email: e.target.value})} className="w-full px-6 py-4 rounded-xl bg-slate-50 border-none font-bold" />
                             </div>
                             <div className="space-y-4">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Discord</label>
                                <input value={edit.social_discord} onChange={e => setEdit({...edit, social_discord: e.target.value})} className="w-full px-6 py-4 rounded-xl bg-slate-50 border-none font-bold" />
                             </div>
                        </div>
                        <div className="glass p-12 rounded-[4rem] space-y-8 border-none">
                            <h4 className="font-display text-2xl font-black mb-4">Social</h4>
                             <div className="space-y-4">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Twitter</label>
                                <input value={edit.social_twitter} onChange={e => setEdit({...edit, social_twitter: e.target.value})} className="w-full px-6 py-4 rounded-xl bg-slate-50 border-none font-bold" />
                             </div>
                             <div className="space-y-4">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Instagram</label>
                                <input value={edit.social_instagram} onChange={e => setEdit({...edit, social_instagram: e.target.value})} className="w-full px-6 py-4 rounded-xl bg-slate-50 border-none font-bold" />
                             </div>
                        </div>
                    </div>
                )}
                
                {tab === 'settings' && (
                    <div className="glass p-12 rounded-[4rem] grid md:grid-cols-2 gap-10 border-none shadow-sm">
                         <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Hero Main Title</label>
                            <input value={edit.hero_title} onChange={e => setEdit({...edit, hero_title: e.target.value})} className="w-full px-8 py-5 rounded-2xl bg-slate-50 border-none font-black tracking-tighter text-3xl" />
                         </div>
                         <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Year</label>
                            <input value={edit.year} onChange={e => setEdit({...edit, year: e.target.value})} className="w-full px-8 py-5 rounded-2xl bg-slate-50 border-none font-bold" />
                         </div>
                    </div>
                )}
            </main>
        </div>
    );
};

// --- Main App ---

export default function App() {
  const { artworks, content, loading, refresh } = useContent();
  const [user, setUser] = useState<any>(null);
  const location = useLocation();

  useEffect(() => {
    supabase.auth.onAuthStateChange((_event, session) => { setUser(session?.user ?? null); });
  }, []);

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#FFF5F7]">
      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
        <Sparkles className="w-12 h-12 text-pink-soft" />
      </motion.div>
      <p className="mt-4 font-display font-black text-[10px] uppercase tracking-[0.4em] text-pink-deep opacity-40">Dreamworld Loading...</p>
    </div>
  );

  return (
    <div className="relative min-h-screen font-sans selection:bg-pink-soft selection:text-white bg-[#FFF5F7]">
      <div className="holo-mesh" />
      <div className="blob-1 floating-blob" />
      <div className="blob-2 floating-blob" />

      <Navbar />

      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<HomePage artworks={artworks} content={content} />} />
          <Route path="/portfolio" element={<PortfolioGallery artworks={artworks} />} />
          <Route path="/about" element={<AboutPage content={content} />} />
          <Route path="/contact" element={<ContactPage content={content} />} />
          <Route path="/admin" element={<AdminPage user={user} artworks={artworks} content={content} onRefresh={refresh} />} />
        </Routes>
      </AnimatePresence>

      <Footer content={content} />

      <video autoPlay muted loop playsInline className="fixed inset-0 w-full h-full object-cover -z-20 opacity-20 blur-3xl pointer-events-none">
        <source src="https://cdn.pixabay.com/video/2021/11/14/95610-642874134_large.mp4" type="video/mp4" />
      </video>
    </div>
  );
}
