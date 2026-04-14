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
  Smartphone,
  Tags,
  Hash
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
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        setLoading(true);
        const { data: arts } = await supabase.from('artworks').select('*, categories(name)').order('created_at', { ascending: false });
        const { data: cats } = await supabase.from('categories').select('*').order('name');
        const { data: settings } = await supabase.from('site_settings').select('*');
        
        if (arts) setArtworks(arts);
        if (cats) setCategories(cats);
        if (settings) {
            const mapped = settings.reduce((acc: any, curr: any) => { acc[curr.key] = curr.value; return acc; }, {});
            setContent({ ...DEFAULT_SITE_CONTENT, ...mapped });
        }
        setLoading(false);
    };

    useEffect(() => { fetchData(); }, []);

    return { content, artworks, categories, loading, refresh: fetchData };
};

const uploadToCloudinary = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
    const response = await fetch(CLOUDINARY_URL, { method: "POST", body: formData });
    if (!response.ok) throw new Error("Upload failed");
    const data = await response.json();
    return data.secure_url;
};

// --- Components ---

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');
  
  useEffect(() => setIsOpen(false), [location]);
  if (isAdmin) return null;

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-6 sm:px-12 py-6 sm:py-8 pointer-events-auto glass-nav">
        <Link to="/" className="flex items-center gap-4 group">
          <span className="font-display font-black text-xl sm:text-2xl tracking-tighter text-slate-800 uppercase group-hover:text-pink-deep transition-colors">
            Jesskae
          </span>
        </Link>
        <div className="hidden md:flex items-center gap-10 font-display text-[11px] font-black text-slate-600 tracking-widest uppercase">
           <Link to="/" className="hover:text-pink-deep transition-colors">Home</Link>
           <Link to="/portfolio" className="hover:text-pink-deep transition-colors">Portfolio</Link>
           <Link to="/about" className="hover:text-pink-deep transition-colors">About</Link>
           <Link to="/contact" className="hover:text-pink-deep transition-colors">Contact</Link>
        </div>
        <button onClick={() => setIsOpen(!isOpen)} className="md:hidden glass p-3 rounded-2xl text-pink-deep">
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </nav>
      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="mobile-nav-panel md:hidden">
             <Link to="/" className="font-display text-4xl font-black text-slate-900 tracking-tighter hover:text-pink-deep">Home</Link>
             <Link to="/portfolio" className="font-display text-4xl font-black text-slate-900 tracking-tighter hover:text-pink-deep">Portfolio</Link>
             <Link to="/about" className="font-display text-4xl font-black text-slate-900 tracking-tighter hover:text-pink-deep">About</Link>
             <Link to="/contact" className="font-display text-4xl font-black text-slate-900 tracking-tighter hover:text-pink-deep">Contact</Link>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

const Footer = ({ content }: any) => {
  const location = useLocation();
  if (location.pathname.startsWith('/admin')) return null;

  return (
    <footer className="py-20 px-6 sm:px-12 border-t border-slate-900/5 bg-pastel-pink/10">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12 text-center md:text-left">
        <div className="flex flex-col md:items-start gap-4">
          <span className="font-display font-black text-3xl tracking-tighter text-slate-900/10 uppercase">Jesskae</span>
          <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">{content.footer_text}</p>
        </div>
        <div className="flex flex-wrap justify-center gap-8 text-[10px] font-bold text-slate-400 tracking-widest uppercase items-center">
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
      <section className="relative min-h-[90vh] sm:min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden">
        {/* Visual Depth Background Orbs */}
        <div className="absolute top-[20%] left-[10%] w-[30vw] h-[30vw] bg-pink-soft/15 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-[20%] right-[10%] w-[40vw] h-[40vw] bg-blue-soft/10 rounded-full blur-[120px] animation-delay-2000 animate-pulse" />
        <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] bg-lavender-soft/10 rounded-full blur-[150px]" />

        {/* Central 3D Bubble/Orb - Overlapping the text */}
        <motion.div 
          animate={{ y: [0, -20, 0], x: [0, 10, 0], scale: [1, 1.02, 1] }} 
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }} 
          className="absolute z-20 w-[45vw] h-[45vw] max-w-[450px] max-h-[450px] glass-bubble opacity-90 pointer-events-none"
          style={{ top: '45%', left: '52%', transform: 'translate(-50%, -50%)' }}
        />
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="hero-glass-container text-center max-w-full"
        >
          <span className="font-display font-black text-slate-500 uppercase tracking-[0.6em] text-[10px] sm:text-[12px] mb-8 sm:mb-12 block opacity-80">{content.hero_subtitle}</span>
          
          <h1 className="hero-title font-display text-[18vw] sm:text-[14vw] font-black leading-[0.8] holo-text text-tight pointer-events-none tracking-tighter">
            {content.hero_title}
          </h1>
          
          <div className="mt-20 sm:mt-28 flex justify-between items-center w-full max-w-[90vw] mx-auto text-[11px] sm:text-xs font-black text-pink-deep tracking-[0.5em] uppercase opacity-80">
            <div className="flex flex-col items-start gap-1">
               <span className="text-[9px] opacity-50">Discovery</span>
               <span>EST. 2018</span>
            </div>
            <div className="flex flex-col items-end gap-1">
               <span className="text-[9px] opacity-50">Current</span>
               <span>{content.year} EDITION</span>
            </div>
          </div>
        </motion.div>
      </section>

      <section className="py-24 sm:py-32 px-6 max-w-6xl mx-auto section-aura">
        <div className="grid lg:grid-cols-2 gap-16 sm:gap-24 items-center">
          <div className="order-2 lg:order-1">
             <div className="aspect-[4/5] rounded-[2.5rem] sm:rounded-[3rem] glossy-blob overflow-hidden bg-white/30 relative flex items-center justify-center group shadow-2xl">
                {content.about_image_url ? (
                  <img src={content.about_image_url} className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-105" alt="About Jesskae" />
                ) : (
                  <Sparkles className="w-24 h-24 text-pink-soft opacity-20" />
                )}
             </div>
          </div>
          <div className="order-1 lg:order-2 text-center lg:text-left">
            <span className="text-pink-deep/60 font-bold text-[10px] sm:text-xs uppercase tracking-widest mb-4 sm:mb-6 block">Introduction</span>
            <h2 className="font-display text-4xl sm:text-5xl font-black text-slate-900 mb-6 sm:mb-8 tracking-tighter leading-tight">{content.about_title}</h2>
            <p className="text-slate-500 text-base sm:text-lg leading-relaxed font-medium mb-8">{content.about_text_1}</p>
            <Link to="/about" className="inline-flex items-center gap-4 font-display font-black text-[10px] sm:text-xs uppercase tracking-widest text-slate-900 hover:text-pink-deep group transition-colors">
              Read My Story <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      <section className="py-24 sm:py-32 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center sm:items-end mb-12 sm:mb-16 gap-6 px-4">
          <h2 className="font-display text-5xl sm:text-6xl font-black text-slate-900 tracking-tighter italic">Gallery</h2>
          <Link to="/portfolio" className="flex items-center gap-3 font-display font-black text-[10px] uppercase tracking-widest text-slate-400 hover:text-pink-deep group transition-colors">View All Archive <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" /></Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-10">
          {(featured.length > 0 ? featured : artworks.slice(0, 4)).map((art: any) => (
            <motion.div key={art.id} whileHover={{ y: -10 }} className="group relative h-[450px] sm:h-[600px] overflow-hidden rounded-[2rem] sm:rounded-[2.5rem] bg-white shadow-xl shadow-pink-100/20 cursor-pointer">
              <img src={art.image_url} alt={art.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2s]" />
              <div className="absolute inset-0 bg-gradient-to-t from-pink-deep/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700 p-8 sm:p-12 flex flex-col justify-end">
                <h4 className="font-display font-black text-3xl sm:text-4xl text-white mb-2">{art.title}</h4>
                <div className="flex gap-3">
                   <span className="px-4 py-1.5 rounded-full glass text-[8px] sm:text-[10px] text-white font-bold uppercase tracking-widest">{art.categories?.name || 'Art'}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="py-24 sm:py-32 px-6 max-w-4xl mx-auto">
         <div className="glass rounded-[2.5rem] sm:rounded-[4rem] p-10 sm:p-20 text-center relative overflow-hidden section-aura">
            <h2 className="font-display text-4xl sm:text-5xl font-black text-slate-900 mb-6 sm:mb-8 tracking-tighter">Stay Connected</h2>
            <p className="text-slate-500 font-medium text-base sm:text-lg mb-10 sm:text-lg sm:mb-12 max-w-md mx-auto">{content.contact_tagline}</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6">
                <a href={`mailto:${content.contact_email}`} className="bg-slate-900 text-white px-10 py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-pink-deep transition-all flex items-center justify-center gap-3"><Mail className="w-4 h-4" /> Email</a>
                <Link to="/contact" className="glass px-10 py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest text-slate-900 hover:bg-white transition-all">Go to Contact</Link>
            </div>
         </div>
      </section>
    </motion.div>
  );
};

// --- Page: About ---
const AboutPage = ({ content }: any) => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pt-32 sm:pt-40 pb-24 sm:pb-32 px-6 max-w-4xl mx-auto">
    <div className="text-center mb-16 sm:mb-24">
       <span className="text-pink-deep font-bold text-[10px] uppercase tracking-widest mb-4 block">Artist Profile</span>
       <h2 className="font-display text-5xl sm:text-7xl font-black text-slate-900 tracking-tighter mb-8 leading-[0.9]">{content.about_page_title}</h2>
    </div>
    <div className="grid gap-8 sm:gap-12 text-slate-600 text-lg sm:text-xl font-medium leading-relaxed">
       <div className="glass p-8 sm:p-12 rounded-[2.5rem] sm:rounded-[3.5rem] border-pink-soft/20 overflow-hidden relative">
          <div className="grid md:grid-cols-[1fr_2fr] gap-8 sm:gap-10 items-center">
             <div className="aspect-[3/4] rounded-2xl sm:rounded-3xl overflow-hidden bg-slate-50 shadow-lg">
                {content.about_image_url && <img src={content.about_image_url} className="w-full h-full object-cover" />}
             </div>
             <div className="text-center md:text-left">
                <p className="mb-6 sm:mb-10 text-slate-900 text-xl sm:text-2xl font-bold leading-snug">"{content.about_text_1}"</p>
                <p className="text-sm sm:text-base">{content.about_text_2}</p>
             </div>
          </div>
       </div>
       <div className="p-4 text-center sm:text-left">
          <h3 className="font-display text-3xl font-black text-slate-900 mb-6 tracking-tight">The Vision</h3>
          <p className="text-sm sm:text-base">{content.about_page_content}</p>
       </div>
    </div>
  </motion.div>
);

// --- Page: Contact (Restored Contact Form) ---
const ContactPage = ({ content }: any) => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pt-32 sm:pt-40 pb-24 sm:pb-32 px-6 max-w-5xl mx-auto">
    <div className="grid lg:grid-cols-2 gap-16 sm:gap-20 items-center">
       <div className="text-center lg:text-left">
          <h2 className="font-display text-6xl sm:text-7xl font-black text-slate-900 tracking-tighter mb-8 sm:mb-10 leading-[0.9]">Let's <span className="holo-text">Talk</span></h2>
          <p className="text-slate-500 text-lg sm:text-xl font-medium mb-10 sm:mb-12">{content.contact_tagline}</p>
          <div className="space-y-4 sm:space-y-6">
             {[
                { label: 'Direct Email', value: content.contact_email, icon: Mail },
                { label: 'Twitter / X', value: content.social_twitter, icon: Twitter },
                { label: 'Instagram', value: content.social_instagram, icon: Instagram },
                { label: 'Discord', value: content.social_discord, icon: MessageSquare }
             ].map(item => (
                <div key={item.label} className="flex items-center justify-center lg:justify-start gap-4 sm:gap-6 group cursor-pointer">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl glass flex items-center justify-center text-pink-deep group-hover:bg-pink-deep group-hover:text-white transition-all"><item.icon className="w-5 h-5 sm:w-6 sm:h-6" /></div>
                    <div className="text-left"><p className="text-[8px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.label}</p><p className="text-lg sm:text-xl font-black text-slate-900">{item.value}</p></div>
                </div>
             ))}
          </div>
       </div>
       <div className="glass p-8 sm:p-12 rounded-[2.5rem] sm:rounded-[3.5rem] relative">
          <h3 className="font-display text-2xl font-black mb-6 text-slate-900">Send an Inquiry</h3>
          <form className="space-y-4 sm:space-y-6">
             {['Full Name', 'Email Address'].map(field => (
                <div key={field} className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-4">{field}</label>
                    <input className="w-full px-6 sm:px-8 py-4 sm:py-5 rounded-2xl bg-white/50 border border-slate-100 font-medium focus:ring-4 focus:ring-pink-soft/10 outline-none transition-all" placeholder={`Enter your ${field.toLowerCase()}`} />
                </div>
             ))}
             <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-4">Message</label>
                <textarea rows={4} className="w-full px-6 sm:px-8 py-4 sm:py-5 rounded-2xl bg-white/50 border border-slate-100 font-medium focus:ring-4 focus:ring-pink-soft/10 outline-none transition-all" placeholder="What's on your mind?" />
             </div>
             <button className="w-full bg-slate-900 text-white py-4 sm:py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-pink-deep shadow-xl flex items-center justify-center gap-3 transition-all">Send Message <Send className="w-4 h-4" /></button>
          </form>
       </div>
    </div>
  </motion.div>
);

// --- Page: Portfolio Gallery ---
const PortfolioGallery = ({ artworks, categories }: any) => {
  const [filter, setFilter] = useState("All");
  const filtered = filter === "All" ? artworks : artworks.filter((a: any) => a.categories?.name === filter);
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pt-32 sm:pt-40 pb-24 sm:pb-32 px-6 max-w-7xl mx-auto">
       <div className="mb-16 sm:mb-20 text-center">
          <h2 className="font-display text-6xl sm:text-8xl font-black text-slate-900 tracking-tighter mb-8 sm:mb-12">Archive</h2>
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
             <button onClick={() => setFilter("All")} className={`px-6 sm:px-10 py-3 sm:py-4 rounded-full font-display font-black text-[10px] uppercase tracking-widest transition-all ${filter === "All" ? 'bg-slate-900 text-white shadow-xl scale-105' : 'glass text-slate-400 hover:text-slate-900'}`}>All</button>
             {categories.map((cat: any) => (
                <button key={cat.id} onClick={() => setFilter(cat.name)} className={`px-6 sm:px-10 py-3 sm:py-4 rounded-full font-display font-black text-[10px] uppercase tracking-widest transition-all ${filter === cat.name ? 'bg-slate-900 text-white shadow-xl scale-105' : 'glass text-slate-400 hover:text-slate-900'}`}>{cat.name}</button>
             ))}
          </div>
       </div>
       <div className="responsive-grid">
          {filtered.map((art: any) => (
             <motion.div key={art.id} layout className="group aspect-square rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden bg-white shadow-lg relative cursor-zoom-in">
                <img src={art.image_url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1.5s]" />
                <div className="absolute inset-0 bg-pink-deep/20 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
             </motion.div>
          ))}
       </div>
    </motion.div>
  );
};

// --- Admin Section Components ---

const AdminSidebar = ({ active, setTab, onLogout, isMobile, onClose }: any) => {
    const sidebar = (
        <aside className={`${isMobile ? 'fixed inset-0 bg-white/95 backdrop-blur-3xl p-10 flex-col items-center justify-center' : 'w-80 bg-white/40 backdrop-blur-xl border-r border-slate-100 flex-col p-10 fixed left-0 top-0 bottom-0'} flex z-50`}>
            {isMobile && <button onClick={onClose} className="absolute top-10 right-10 text-slate-900"><X /></button>}
            <div className={`mb-14 ${isMobile ? 'text-center' : ''}`}>
                <span className="font-display font-black text-3xl tracking-tighter text-slate-900 uppercase">Jesskae</span>
                <p className="text-pink-deep text-[10px] font-black uppercase tracking-widest mt-1 ml-1 opacity-60">Admin CMS</p>
            </div>
            <nav className={`flex-1 space-y-3 font-display w-full ${isMobile ? 'max-w-xs' : ''}`}>
                {[
                    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
                    { id: 'portfolio', label: 'Portfolio', icon: ImageIcon },
                    { id: 'categories', label: 'Categories', icon: Tags },
                    { id: 'about', label: 'Story & Bio', icon: User },
                    { id: 'contact', label: 'Inquiry & Social', icon: MessageSquare },
                    { id: 'settings', label: 'Globals', icon: Settings },
                ].map(tab => (
                    <button 
                        key={tab.id} onClick={() => { setTab(tab.id); if(isMobile) onClose(); }}
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
    return isMobile ? <AnimatePresence>{active && sidebar}</AnimatePresence> : sidebar;
};

const AdminPage = ({ user, artworks, categories, content, onRefresh }: any) => {
    const [tab, setTab] = useState("dashboard");
    const [edit, setEdit] = useState(content);
    const [saving, setSaving] = useState(false);
    const [modal, setModal] = useState(false);
    const [newItem, setNewItem] = useState({ title: "", category_id: "", image_url: "", is_featured: false });
    const [uploading, setUploading] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const navigate = useNavigate();

    const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 1024);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const saveChanges = async () => {
        setSaving(true);
        try {
            for (const [key, value] of Object.entries(edit)) {
                await supabase.from('site_settings').upsert({ key, value: String(value) });
            }
            onRefresh(); alert("Changes published successfully!");
        } catch (err) { alert(err); }
        setSaving(false);
    };

    const handleCloudinaryUpload = async (file: File, isAbout: boolean = false) => {
        setUploading(true);
        try {
            const url = await uploadToCloudinary(file);
            isAbout ? setEdit({ ...edit, about_image_url: url }) : setNewItem({ ...newItem, image_url: url });
        } catch (err) { alert("Upload failed."); }
        setUploading(false);
    };

    const addArt = async (e: any) => {
        e.preventDefault();
        if (!newItem.image_url) return alert("Upload an image first.");
        if (!newItem.category_id) return alert("Select a category.");
        setSaving(true);
        const { error } = await supabase.from('artworks').insert([newItem]);
        if (error) alert(error.message);
        else { setModal(false); setNewItem({ title: "", category_id: "", image_url: "", is_featured: false }); onRefresh(); }
        setSaving(false);
    };

    const addCategory = async () => {
        const name = prompt("Category Name:");
        if (name) {
            const { error } = await supabase.from('categories').insert([{ name }]);
            if (error) alert(error.message);
            else onRefresh();
        }
    };

    if (!user) return (
        <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 bg-white/20 backdrop-blur-xl">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="glass p-8 sm:p-12 rounded-[2.5rem] sm:rounded-[3.5rem] w-full max-w-md shadow-2xl text-center">
                <h2 className="font-display text-4xl font-black text-slate-900 mb-8 tracking-tighter">Portal Access</h2>
                <form onSubmit={async (e) => {
                    e.preventDefault(); setSaving(true);
                    const { error } = await supabase.auth.signInWithPassword({ email: (e.target as any).email.value, password: (e.target as any).password.value });
                    if (error) alert(error.message); setSaving(false);
                }} className="space-y-4">
                    <input name="email" required type="email" placeholder="Email" className="w-full px-6 py-4 rounded-xl bg-slate-50 border border-slate-100 font-medium outline-none focus:ring-2 focus:ring-pink-soft transition-all" />
                    <input name="password" required type="password" placeholder="Password" className="w-full px-6 py-4 rounded-xl bg-slate-50 border border-slate-100 font-medium outline-none focus:ring-2 focus:ring-pink-soft transition-all" />
                    <button disabled={saving} className="w-full bg-slate-900 text-white py-4 rounded-xl font-black uppercase tracking-widest hover:bg-pink-deep transition-all shadow-lg active:scale-95 disabled:opacity-50">Login</button>
                </form>
                <Link to="/" className="mt-8 block font-black text-[10px] uppercase tracking-widest text-slate-400 hover:text-slate-900">Cancel</Link>
            </motion.div>
        </div>
    );

    return (
        <div className={`min-h-screen ${!isMobile ? 'pl-80' : ''}`}>
            {isMobile && (
                <div className="fixed top-6 right-6 z-[60] flex gap-2">
                    <button onClick={() => setIsSidebarOpen(true)} className="glass p-4 rounded-2xl text-pink-deep shadow-lg"><Menu className="w-6 h-6" /></button>
                </div>
            )}
            
            <AnimatePresence>
                {(isSidebarOpen || !isMobile) && (
                    <motion.div 
                        initial={isMobile ? { x: -300, opacity: 0 } : { opacity: 1 }}
                        animate={isMobile ? { x: 0, opacity: 1 } : { opacity: 1 }}
                        exit={isMobile ? { x: -300, opacity: 0 } : { opacity: 1 }}
                        className="fixed inset-y-0 left-0 z-50 overflow-hidden"
                    >
                        <AdminSidebar 
                            active={tab} setTab={setTab} 
                            onLogout={async () => { await supabase.auth.signOut(); navigate("/"); }} 
                            isMobile={isMobile} onClose={() => setIsSidebarOpen(false)} 
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            {isMobile && isSidebarOpen && <div onClick={() => setIsSidebarOpen(false)} className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 transition-opacity" />}

            <main className="p-6 sm:p-12 lg:p-16 max-w-7xl mx-auto">
                 <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 sm:mb-16 gap-6 pt-16 sm:pt-0">
                    <div>
                        <h2 className="font-display text-4xl sm:text-5xl font-black text-slate-900 tracking-tighter capitalize">{tab}</h2>
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Management Portal</p>
                    </div>
                    {tab !== 'dashboard' && tab !== 'portfolio' && tab !== 'categories' && (
                        <button onClick={saveChanges} disabled={saving} className="w-full sm:w-auto bg-slate-900 text-white px-10 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-pink-deep transition-all active:scale-95">
                            {saving ? "Saving..." : "Publish Changes"}
                        </button>
                    )}
                </header>
                
                {tab === 'dashboard' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                        <div className="glass p-8 sm:p-12 rounded-3xl sm:rounded-[3.5rem] text-center font-display uppercase tracking-widest text-[10px] text-slate-400 shadow-sm">
                            <p className="mb-4">Artworks</p>
                            <p className="text-6xl sm:text-7xl font-black text-slate-900">{artworks.length}</p>
                        </div>
                        <div className="glass p-8 sm:p-12 rounded-3xl sm:rounded-[3.5rem] text-center font-display uppercase tracking-widest text-[10px] text-slate-400 shadow-sm">
                            <p className="mb-4">Categories</p>
                            <p className="text-6xl sm:text-7xl font-black text-slate-900">{categories.length}</p>
                        </div>
                    </div>
                )}

                {tab === 'portfolio' && (
                    <div className="space-y-6 sm:space-y-10">
                        <div className="flex justify-end"><button onClick={() => setModal(true)} className="w-full sm:w-auto bg-pink-deep text-white px-8 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2"><Plus /> Add Artwork</button></div>
                        <div className="grid grid-cols-1 gap-4">
                            {artworks.map((art: any) => (
                                <div key={art.id} className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 p-4 sm:p-5 glass rounded-2xl sm:rounded-3xl group">
                                    <img src={art.image_url} className="w-full sm:w-20 h-48 sm:h-20 rounded-xl object-cover" />
                                    <div className="flex-1">
                                        <p className="font-black text-slate-900 uppercase tracking-tight text-sm sm:text-base">{art.title}</p>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{art.categories?.name} {art.is_featured && '• Featured'}</p>
                                    </div>
                                    <div className="flex justify-end w-full sm:w-auto">
                                        <button onClick={async () => { if(confirm("Delete?")) { await supabase.from('artworks').delete().eq('id', art.id); onRefresh(); } }} className="p-2 sm:p-0 text-slate-200 hover:text-red-500 transition-colors"><Trash2 className="w-6 h-6 sm:w-5 sm:h-5" /></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {modal && (
                            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-slate-900/40 backdrop-blur-md">
                                <form onSubmit={addArt} className="bg-white p-8 sm:p-12 rounded-3xl sm:rounded-[3rem] w-full max-w-2xl max-h-[90vh] overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10 relative">
                                    <button type="button" onClick={() => setModal(false)} className="absolute top-6 right-6 sm:top-10 sm:right-10 text-slate-400 hover:text-slate-900"><X /></button>
                                    <div className="space-y-6">
                                        <h4 className="font-display text-3xl sm:text-4xl font-black uppercase tracking-tighter">New Piece</h4>
                                        <input placeholder="Artwork Title" required className="w-full px-6 py-4 rounded-xl bg-slate-50 border-none outline-none font-bold" value={newItem.title} onChange={e => setNewItem({...newItem, title: e.target.value})} />
                                        <select required className="w-full px-6 py-4 rounded-xl bg-slate-50 border-none font-bold text-slate-400 outline-none" value={newItem.category_id} onChange={e => setNewItem({...newItem, category_id: e.target.value})}>
                                            <option value="">Select Category</option>
                                            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                        </select>
                                        <div className="relative">
                                            <input type="file" accept="image/*" onChange={(e: any) => handleCloudinaryUpload(e.target.files[0])} className="hidden" id="art-up" />
                                            <label htmlFor="art-up" className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-xl bg-slate-50 font-bold text-slate-400 text-xs cursor-pointer hover:bg-slate-100 transition-all">
                                                {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />} Upload Image
                                            </label>
                                        </div>
                                        <label className="flex items-center gap-4 cursor-pointer text-[10px] font-black uppercase tracking-widest text-slate-400">
                                            <input type="checkbox" checked={newItem.is_featured} onChange={e => setNewItem({...newItem, is_featured: e.target.checked})} className="w-4 h-4 accent-pink-deep" /> 
                                            Feature on Home
                                        </label>
                                        <button disabled={uploading || saving} className="w-full bg-slate-900 text-white py-5 rounded-xl font-black uppercase tracking-widest hover:bg-pink-deep transition-colors shadow-xl active:scale-95 disabled:opacity-50">Create Piece</button>
                                    </div>
                                    <div className="flex items-center justify-center bg-slate-50 rounded-2xl sm:rounded-[2.5rem] border-2 border-dashed border-slate-200 min-h-[250px]">
                                        {newItem.image_url ? <img src={newItem.image_url} className="w-full h-full object-cover rounded-2xl sm:rounded-[2.5rem]" /> : <ImageIcon className="w-12 h-12 opacity-10" />}
                                    </div>
                                </form>
                            </div>
                        )}
                    </div>
                )}

                {tab === 'categories' && (
                    <div className="space-y-8 glass p-8 sm:p-12 rounded-3xl sm:rounded-[3.5rem]">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <h4 className="font-display text-2xl font-black uppercase tracking-tight">Categories Tracker</h4>
                            <button onClick={addCategory} className="w-full sm:w-auto bg-slate-900 text-white p-4 rounded-xl flex items-center justify-center hover:bg-pink-deep transition-all"><Plus /></button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {categories.map(cat => (
                                <div key={cat.id} className="flex justify-between items-center p-5 sm:p-6 bg-white/60 rounded-2xl border border-white">
                                    <span className="font-black text-slate-900 uppercase tracking-tight flex items-center gap-3 text-sm sm:text-base"><Hash className="w-4 h-4 text-pink-deep" /> {cat.name}</span>
                                    <button onClick={async () => { if(confirm("Remove?")) { await supabase.from('categories').delete().eq('id', cat.id); onRefresh(); } }} className="text-slate-300 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {tab === 'about' && (
                    <div className="grid grid-cols-1 gap-8 sm:gap-12 glass p-6 sm:p-12 rounded-3xl sm:rounded-[3.5rem]">
                        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
                            <div className="flex flex-col items-center gap-6">
                                <div className="aspect-[3/4] w-full sm:w-64 rounded-2xl sm:rounded-[2.5rem] bg-slate-50 relative group overflow-hidden shadow-2xl">
                                    {edit.about_image_url ? <img src={edit.about_image_url} className="w-full h-full object-cover" /> : <User className="w-12 h-12 opacity-10 font-bold" />}
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                        <input type="file" accept="image/*" onChange={(e: any) => handleCloudinaryUpload(e.target.files[0], true)} className="hidden" id="abt-up" />
                                        <label htmlFor="abt-up" className="bg-white px-6 py-2 rounded-full font-black text-[10px] uppercase tracking-widest cursor-pointer hover:bg-pink-soft">Update Photo</label>
                                    </div>
                                </div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Profile Asset</p>
                            </div>
                            <div className="flex-1 space-y-6">
                                <div className="space-y-2"><label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Bio Header</label><input value={edit.about_title} onChange={e => setEdit({...edit, about_title: e.target.value})} className="w-full bg-slate-50 p-5 sm:p-6 rounded-2xl font-black text-xl sm:text-2xl outline-none focus:ring-2 focus:ring-pink-soft transition-all" /></div>
                                <div className="space-y-2"><label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Short Intro</label><textarea rows={3} value={edit.about_text_1} onChange={e => setEdit({...edit, about_text_1: e.target.value})} className="w-full bg-slate-50 p-5 sm:p-6 rounded-2xl font-medium outline-none focus:ring-2 focus:ring-pink-soft transition-all text-sm sm:text-base" /></div>
                                <div className="space-y-2"><label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Full Narrative</label><textarea rows={10} value={edit.about_page_content} onChange={e => setEdit({...edit, about_page_content: e.target.value})} className="w-full bg-slate-50 p-5 sm:p-6 rounded-2xl font-medium outline-none focus:ring-2 focus:ring-pink-soft transition-all text-sm sm:text-base leading-relaxed" /></div>
                            </div>
                        </div>
                    </div>
                )}

                {tab === 'contact' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                        {[
                            { k: 'contact_email', l: 'Inquiry Email' },
                            { k: 'contact_tagline', l: 'Contact Tagline' },
                            { k: 'social_twitter', l: 'Twitter URL' },
                            { k: 'social_instagram', l: 'Instagram URL' },
                            { k: 'social_discord', l: 'Discord Tag' }
                        ].map(f => (
                            <div key={f.k} className="glass p-6 sm:p-8 rounded-2xl sm:rounded-3xl space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">{f.l}</label>
                                <input value={edit[f.k]} onChange={e => setEdit({...edit, [f.k]: e.target.value})} className="w-full bg-white/40 p-5 rounded-xl font-bold border-none outline-none focus:ring-2 focus:ring-pink-soft transition-all text-sm sm:text-base" />
                            </div>
                        ))}
                    </div>
                )}

                {tab === 'settings' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 glass p-6 sm:p-12 rounded-3xl sm:rounded-[3.5rem]">
                        {[
                            { k: 'hero_title', l: 'Hero Title' },
                            { k: 'hero_subtitle', l: 'Hero Subtitle' },
                            { k: 'year', l: 'Copyright Year' },
                            { k: 'footer_text', l: 'Footer Tagline' }
                        ].map(f => (
                            <div key={f.k} className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">{f.l}</label>
                                <input value={edit[f.k]} onChange={e => setEdit({...edit, [f.k]: e.target.value})} className="w-full bg-slate-50 p-5 sm:p-6 rounded-2xl font-black text-lg sm:text-xl outline-none focus:ring-2 focus:ring-pink-soft transition-all" />
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

// --- Main App ---

export default function App() {
  const { artworks, categories, content, loading, refresh } = useContent();
  const [user, setUser] = useState<any>(null);
  const location = useLocation();

  useEffect(() => {
    supabase.auth.onAuthStateChange((_event, session) => { setUser(session?.user ?? null); });
  }, []);

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <Sparkles className="w-12 h-12 text-pink-soft animate-spin" />
    </div>
  );

  return (
    <div className="relative min-h-screen font-sans selection:bg-pink-soft selection:text-white">
      <div className="holo-mesh" />
      <div className="blob-1 floating-blob" />
      <div className="blob-2 floating-blob" />

      <Navbar />

      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<HomePage artworks={artworks} content={content} />} />
          <Route path="/portfolio" element={<PortfolioGallery artworks={artworks} categories={categories} />} />
          <Route path="/about" element={<AboutPage content={content} />} />
          <Route path="/contact" element={<ContactPage content={content} />} />
          <Route path="/admin" element={<AdminPage user={user} artworks={artworks} categories={categories} content={content} onRefresh={refresh} />} />
        </Routes>
      </AnimatePresence>

      <Footer content={content} />
    </div>
  );
}
