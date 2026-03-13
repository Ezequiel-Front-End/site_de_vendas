import { ShoppingCart, Heart, Search, Star, Eye, Trash2, X, Plus, Minus, Instagram, Facebook, Twitter, MapPin, Phone, Mail, ChevronLeft, ChevronRight, Filter, Menu, Clock } from 'lucide-react';
import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Routes, Route, Link, useNavigate, useParams, useLocation } from 'react-router-dom';

// --- Types ---
interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  color: string;
  size: string;
  rating: number;
}

interface CartItem extends Product {
  quantity: number;
}

// --- Mock Data ---
const PRODUCTS: Product[] = [
  { id: 22, name: "Vestido de Festa Renda Princesa", price: 85.00, image: "https://lh3.googleusercontent.com/d/1gC7QK4PomPD3oV3b9p-HFulYKEXtf0uS", category: "Roupas", color: "Branco", size: "4", rating: 5 },
  { id: 23, name: "Vestido Floral Blogueirinha Tule", price: 45.00, image: "https://lh3.googleusercontent.com/d/1X8zb7mzBzpM7JxaUa9TDXmmWk4lTMQgY", category: "Roupas", color: "Floral", size: "2", rating: 5 },
  { id: 24, name: "Jardineira Jeans Salmão Luxúria", price: 60.00, image: "https://lh3.googleusercontent.com/d/1tbTRijNHPqYH2YXDLrQJYet6oZ8gzVr0", category: "Roupas", color: "Salmão", size: "2", rating: 5 },
  { id: 25, name: "Vestido Modal Blog Coração", price: 48.00, image: "https://lh3.googleusercontent.com/d/1vLbsAJoUP093v5XVnd4fnW8fFifiXRj7", category: "Roupas", color: "Rosa", size: "2", rating: 5 },
  { id: 26, name: "Vestido Aquarela Coração", price: 45.00, image: "https://lh3.googleusercontent.com/d/19gRnWB3-xMGPEeS4iOj6ZO3BkNIjoYuI", category: "Roupas", color: "Aquarela", size: "3", rating: 5 },
  { id: 27, name: "Vestido Malha Azul Bebê Princesa", price: 45.00, image: "https://lh3.googleusercontent.com/d/1lWhFY1k_2nTLCzPhcWZ6MYsvfR_QZqiM", category: "Roupas", color: "Azul Bebê", size: "6", rating: 5 },
  { id: 28, name: "Vestido Malha Azul Bebê Princesa (V2)", price: 45.00, image: "https://lh3.googleusercontent.com/d/17a9K9lCwXSNqrml3_l4i-yhXII6kkIuC", category: "Roupas", color: "Azul Bebê", size: "6", rating: 5 },
  { id: 21, name: "Conjunto Blogueirinha Pink", price: 50.00, image: "https://lh3.googleusercontent.com/d/1clYv5PoBf0_J89kVxG3kgWEje95H24KI", category: "Roupas", color: "Rosa", size: "4", rating: 5 },
  { id: 18, name: "Conjunto Blogueirinha Pérola", price: 85.00, image: "https://lh3.googleusercontent.com/d/1dhPbuK-onWFfNrQ965IApg2yj-GInVyj", category: "Roupas", color: "Branco Lilás", size: "6", rating: 5 },
  { id: 19, name: "Conjunto Blogueirinha Salmão", price: 95.00, image: "https://lh3.googleusercontent.com/d/18-uJgJQTKJwk--xI0Cri8702wLJWjsIq", category: "Roupas", color: "Salmão", size: "6", rating: 5 },
  { id: 20, name: "Conjunto Blogueirinha Floral", price: 60.00, image: "https://lh3.googleusercontent.com/d/1rmVn-y9dkK65As76lzWaJkTPjSC7f-a5", category: "Roupas", color: "Floral", size: "8", rating: 5 },
  { id: 17, name: "Havaianas Original Top", price: 110.00, image: "https://lh3.googleusercontent.com/d/1sj8GYfTke9RkJdoV-MF6CgWCgQNCxemh", category: "Chinelos", color: "Café", size: "23/24", rating: 5 },
  { id: 16, name: "Havaianas Slim Borboletas", price: 129.00, image: "https://lh3.googleusercontent.com/d/1xMyqW_hX2sB1SNLIAW04tgyVdUnO44zm", category: "Chinelos", color: "Branco", size: "23/24", rating: 5 }
];

const ITEMS_PER_PAGE = 6;

const WHATSAPP_NUMBER = "5511983086176";

const CLOTHING_SIZES = ["2", "3", "4", "6", "8"];
const FOOTWEAR_SIZES = ["23/24"];
const ALL_SIZES = [...CLOTHING_SIZES, ...FOOTWEAR_SIZES];

export default function App() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedFilters, setSelectedFilters] = useState({
    category: [] as string[],
    color: [] as string[],
    size: [] as string[],
  });

  const navigate = useNavigate();
  const location = useLocation();

  // --- Handlers ---
  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (id: number) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id: number, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const toggleFavorite = (id: number) => {
    setFavorites(prev => prev.includes(id) ? prev.filter(fid => fid !== id) : [...prev, id]);
  };

  const toggleFilter = (type: keyof typeof selectedFilters, value: string) => {
    setSelectedFilters(prev => {
      const current = prev[type];
      const next = current.includes(value) ? current.filter(v => v !== value) : [...current, value];
      return { ...prev, [type]: next };
    });
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSelectedFilters({ category: [], color: [], size: [] });
    setCurrentPage(1);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedFilters.category.length === 0 || selectedFilters.category.includes(p.category);
      const matchesColor = selectedFilters.color.length === 0 || selectedFilters.color.includes(p.color);
      const matchesSize = selectedFilters.size.length === 0 || selectedFilters.size.includes(p.size);
      return matchesSearch && matchesCategory && matchesColor && matchesSize;
    });
  }, [searchQuery, selectedFilters]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleCheckout = () => {
    const cartItems = cart.map(item => 
      `• ${item.name} (${item.quantity}x) - R$ ${(item.price * item.quantity).toFixed(2).replace('.', ',')}`
    ).join('\n');
    
    const message = `Olá! Gostaria de finalizar a compra dos seguintes itens:\n\n${cartItems}\n\n*Total: R$ ${cartTotal.toFixed(2).replace('.', ',')}*`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="min-h-screen flex flex-col font-sans transition-colors duration-300">
      {/* --- Header --- */}
      <header className="sticky top-0 z-40 glass border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 md:gap-8 flex-1">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 md:hidden text-slate-600 hover:bg-slate-100 rounded-md transition-all"
            >
              <Menu className="w-6 h-6" />
            </button>
            <Link to="/" className="text-xl md:text-2xl font-black tracking-tighter text-slate-900 whitespace-nowrap">
              CLOSET WEPINK KIDS
            </Link>
            <div className="relative max-w-md w-full hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar produtos..."
                className="w-full pl-10 pr-4 py-2 bg-slate-100 border-none rounded-md focus:ring-2 focus:ring-slate-200 outline-none text-sm transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <button 
              onClick={() => setIsFavoritesOpen(true)}
              className="p-2.5 rounded-md hover:bg-slate-100 text-slate-600 transition-all relative"
            >
              <Heart className={`w-5 h-5 ${favorites.length > 0 ? 'fill-red-500 text-red-500' : ''}`} />
              {favorites.length > 0 && (
                <span className="absolute top-1 right-1 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {favorites.length}
                </span>
              )}
            </button>
            <button 
              onClick={() => setIsCartOpen(true)}
              className="p-2.5 rounded-md hover:bg-slate-100 text-slate-600 transition-all relative"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 bg-slate-900 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      <Routes>
        <Route path="/" element={
          <Home 
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedFilters={selectedFilters}
            toggleFilter={toggleFilter}
            clearFilters={clearFilters}
            filteredProducts={filteredProducts}
            paginatedProducts={paginatedProducts}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalPages={totalPages}
            favorites={favorites}
            toggleFavorite={toggleFavorite}
            addToCart={addToCart}
          />
        } />
        <Route path="/product/:id" element={
          <ProductDetail 
            addToCart={addToCart}
            toggleFavorite={toggleFavorite}
            favorites={favorites}
          />
        } />
      </Routes>

      {/* --- Footer --- */}
      <footer className="bg-slate-900 text-white py-20 mt-40">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="space-y-6">
            <h3 className="text-2xl font-black tracking-tighter">CLOSET WEPINK KIDS</h3>
            <p className="text-slate-400 text-sm leading-relaxed">Sua boutique online definitiva para moda contemporânea e acessórios de luxo.</p>
            <div className="flex gap-4 pt-4">
              <a href="#" className="w-10 h-10 rounded-md bg-slate-800 flex items-center justify-center hover:bg-slate-700 transition-all text-white">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-md bg-slate-800 flex items-center justify-center hover:bg-slate-700 transition-all text-white">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-md bg-slate-800 flex items-center justify-center hover:bg-slate-700 transition-all text-white">
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </div>
          <div>
            <h4 className="font-black text-[10px] uppercase tracking-[0.2em] mb-8 text-slate-500">Links Úteis</h4>
            <ul className="space-y-4 text-sm text-slate-400">
              <li><a href="#" className="hover:text-white transition-colors">Sobre Nós</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Termos de Serviço</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Política de Privacidade</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contato</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-black text-[10px] uppercase tracking-[0.2em] mb-8 text-slate-500">Suporte</h4>
            <ul className="space-y-4 text-sm text-slate-400">
              <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Envio e Devoluções</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Rastreamento</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Guia de Tamanhos</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-black text-[10px] uppercase tracking-[0.2em] mb-8 text-slate-500">Atendimento</h4>
            <ul className="space-y-4 text-sm text-slate-400">
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-slate-600" />
                <span>(11) 95852-8278</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-slate-600" />
                <span>contato@lojavirtual.com</span>
              </li>
              <li className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-slate-600" />
                <span>Seg - Sex: 09h às 18h</span>
              </li>
              <li className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-slate-600" />
                <span>São Paulo, SP - Brasil</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 mt-20 pt-10 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-slate-500 text-[10px] uppercase tracking-widest">© 2026 CLOSET WEPINK KIDS. TODOS OS DIREITOS RESERVADOS.</p>
          <div className="flex items-center gap-8 text-slate-500 text-[10px] font-black uppercase tracking-widest">
            <span>Brasil</span>
            <span>Segurança Garantida</span>
          </div>
        </div>
      </footer>

      {/* --- Cart Drawer --- */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 shadow-2xl flex flex-col"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <h3 className="text-lg font-black flex items-center gap-2 uppercase tracking-tight">
                  <ShoppingCart className="w-5 h-5" />
                  Carrinho
                </h3>
                <button 
                  onClick={() => setIsCartOpen(false)}
                  className="p-2 hover:bg-slate-100 rounded-md transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-4">
                    <ShoppingCart className="w-12 h-12 opacity-20" />
                    <p className="text-sm font-medium">Seu carrinho está vazio</p>
                    <button 
                      onClick={() => setIsCartOpen(false)}
                      className="text-slate-900 font-black text-xs uppercase tracking-widest hover:underline"
                    >
                      Voltar para a loja
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {cart.map(item => (
                      <div key={item.id} className="flex gap-4 group">
                        <div className="w-20 h-20 rounded-md overflow-hidden flex-shrink-0 border border-slate-100">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 flex flex-col justify-between py-0.5">
                          <div>
                            <div className="flex justify-between items-start">
                              <h4 className="font-bold text-slate-900 text-sm leading-tight">{item.name}</h4>
                              <button 
                                onClick={() => removeFromCart(item.id)}
                                className="text-slate-300 hover:text-red-500 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                            <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-wider">{item.category} • {item.size}</p>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center border border-slate-200 rounded-md overflow-hidden">
                              <button 
                                onClick={() => updateQuantity(item.id, -1)}
                                className="p-1.5 hover:bg-slate-50 transition-colors"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="w-8 text-center text-xs font-bold">{item.quantity}</span>
                              <button 
                                onClick={() => updateQuantity(item.id, 1)}
                                className="p-1.5 hover:bg-slate-50 transition-colors"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                            <p className="font-black text-sm">R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {cart.length > 0 && (
                <div className="p-6 border-t border-slate-100 bg-white">
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-slate-500 font-medium text-sm">Subtotal</span>
                    <span className="text-xl font-black">R$ {cartTotal.toFixed(2).replace('.', ',')}</span>
                  </div>
                  <button 
                    onClick={handleCheckout}
                    className="w-full bg-slate-900 text-white py-4 rounded-md font-black text-sm uppercase tracking-widest transition-all shadow-xl shadow-slate-900/10 hover:scale-[1.02]"
                  >
                    Finalizar Compra
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* --- Favorites Drawer --- */}
      <AnimatePresence>
        {isFavoritesOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFavoritesOpen(false)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 shadow-2xl flex flex-col"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <h3 className="text-lg font-black flex items-center gap-2 uppercase tracking-tight">
                  <Heart className="w-5 h-5 text-red-500 fill-red-500" />
                  Favoritos
                </h3>
                <button 
                  onClick={() => setIsFavoritesOpen(false)}
                  className="p-2 hover:bg-slate-100 rounded-md transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                {favorites.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-4">
                    <Heart className="w-12 h-12 opacity-20" />
                    <p className="text-sm font-medium">Nenhum item favorito</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {favorites.map(id => {
                      const product = PRODUCTS.find(p => p.id === id);
                      if (!product) return null;
                      return (
                        <div key={id} className="flex gap-4 group">
                          <div className="w-20 h-20 rounded-md overflow-hidden flex-shrink-0 border border-slate-100">
                            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1 flex flex-col justify-between py-0.5">
                            <div className="flex justify-between items-start">
                              <h4 className="font-bold text-slate-900 text-sm">{product.name}</h4>
                              <button 
                                onClick={() => toggleFavorite(id)}
                                className="text-red-500 hover:text-red-600 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                            <div className="flex items-center justify-between">
                              <p className="font-black text-sm">R$ {product.price.toFixed(2).replace('.', ',')}</p>
                              <button 
                                onClick={() => addToCart(product)}
                                className="text-[10px] font-black text-slate-900 uppercase tracking-widest hover:underline"
                              >
                                Adicionar
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* --- Mobile Menu Drawer --- */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 md:hidden"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed left-0 top-0 h-full w-full max-w-xs bg-white z-50 shadow-2xl flex flex-col md:hidden"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <h3 className="text-lg font-black flex items-center gap-2 uppercase tracking-tight">
                  Menu
                </h3>
                <button 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 hover:bg-slate-100 rounded-md transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                <div className="space-y-8">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Buscar produtos..."
                      className="w-full pl-10 pr-4 py-3 bg-slate-100 border-none rounded-md outline-none text-sm"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>

                  <div>
                    <h4 className="font-black text-[10px] uppercase tracking-widest mb-4 text-slate-400">Categorias</h4>
                    <div className="space-y-3">
                      {["Roupas", "Chinelos"].map(cat => (
                        <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                          <input
                            type="checkbox"
                            className="w-5 h-5 rounded border-slate-200 bg-transparent text-slate-900 focus:ring-slate-200 transition-all"
                            checked={selectedFilters.category.includes(cat)}
                            onChange={() => toggleFilter('category', cat)}
                          />
                          <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-all">{cat}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-black text-[10px] uppercase tracking-widest mb-4 text-slate-400">Cores</h4>
                    <div className="space-y-3">
                      {["Branco", "Azul", "Roxo", "Rosa", "Café", "Branco Lilás", "Salmão", "Floral"].map(color => (
                        <label key={color} className="flex items-center gap-3 cursor-pointer group">
                          <input
                            type="checkbox"
                            className="w-5 h-5 rounded border-slate-200 bg-transparent text-slate-900 focus:ring-slate-200 transition-all"
                            checked={selectedFilters.color.includes(color)}
                            onChange={() => toggleFilter('color', color)}
                          />
                          <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-all">{color}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-black text-[10px] uppercase tracking-widest mb-4 text-slate-400">Tamanhos Roupas</h4>
                    <div className="flex flex-wrap gap-2">
                      {CLOTHING_SIZES.map(size => (
                        <button
                          key={size}
                          onClick={() => toggleFilter('size', size)}
                          className={`w-10 h-10 flex items-center justify-center rounded-md border text-[10px] font-black transition-all ${selectedFilters.size.includes(size) ? 'bg-slate-900 text-white border-slate-900' : 'border-slate-200 text-slate-400 hover:border-slate-900'}`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-black text-[10px] uppercase tracking-widest mb-4 text-slate-400">Tamanhos Chinelos</h4>
                    <div className="flex flex-wrap gap-2">
                      {FOOTWEAR_SIZES.map(size => (
                        <button
                          key={size}
                          onClick={() => toggleFilter('size', size)}
                          className={`w-12 h-10 flex items-center justify-center rounded-md border text-[10px] font-black transition-all ${selectedFilters.size.includes(size) ? 'bg-slate-900 text-white border-slate-900' : 'border-slate-200 text-slate-400 hover:border-slate-900'}`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button 
                    onClick={clearFilters}
                    className="w-full py-4 bg-slate-900 text-white rounded-md font-black text-[10px] uppercase tracking-widest hover:bg-black transition-all"
                  >
                    Limpar Filtros
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* --- Fixed WhatsApp Button --- */}
      <a 
        href={`https://wa.me/${WHATSAPP_NUMBER}`} 
        target="_blank" 
        rel="noopener noreferrer"
        className="fixed bottom-8 right-8 z-50 bg-[#25D366] text-white px-6 py-3 rounded-full shadow-2xl shadow-[#25D366]/40 hover:scale-110 active:scale-95 transition-all flex items-center gap-3 group"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
        </svg>
        <span className="text-[10px] font-black uppercase tracking-widest whitespace-nowrap">
          Fale Conosco
        </span>
      </a>
    </div>
  );
}

// --- Components ---

function Home({ 
  searchQuery, 
  setSearchQuery, 
  selectedFilters, 
  toggleFilter, 
  clearFilters, 
  filteredProducts, 
  paginatedProducts, 
  currentPage, 
  setCurrentPage, 
  totalPages,
  favorites,
  toggleFavorite,
  addToCart
}: any) {
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const navigate = useNavigate();
  return (
    <>
      {/* --- Hero Section --- */}
      <section className="relative h-[400px] md:h-[500px] overflow-hidden bg-gray-900">
        <img
          src="https://lh3.googleusercontent.com/d/1te3N-wHt7EKQ4ZmONkjTLmBFtvbfKpUk"
          alt="Hero"
          className="absolute inset-0 w-full h-full object-cover opacity-60"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 h-full flex flex-col justify-center items-start text-white">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-black uppercase leading-tight mb-6 max-w-2xl tracking-tighter"
          >
            Elegância em <br /> cada momento
          </motion.h2>
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white text-black px-8 py-4 rounded-md font-bold text-sm uppercase tracking-widest transition-all hover:bg-gray-100"
          >
            Faça sua primeira compra
          </motion.button>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 py-20 flex flex-col md:flex-row gap-16 flex-1 w-full">
        {/* --- Sidebar Filters (Desktop) --- */}
        <aside className="hidden md:block w-64 flex-shrink-0">
          <div className="flex items-center justify-between mb-10">
            <h3 className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Filtrar por:
            </h3>
            <button 
              onClick={clearFilters}
              className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-red-500 transition-colors"
            >
              Limpar
            </button>
          </div>

          <div className="space-y-10">
            {/* Tipo */}
            <div>
              <h4 className="font-black text-[10px] uppercase tracking-widest mb-5 text-slate-400">Tipo</h4>
              <div className="space-y-3">
                {["Roupas", "Chinelos"].map(cat => (
                  <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-slate-200 bg-transparent text-slate-900 focus:ring-slate-200 transition-all"
                      checked={selectedFilters.category.includes(cat)}
                      onChange={() => toggleFilter('category', cat)}
                    />
                    <span className="text-sm text-slate-500 group-hover:text-slate-900 transition-all">{cat}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Cor */}
            <div>
              <h4 className="font-black text-[10px] uppercase tracking-widest mb-5 text-slate-400">Cor</h4>
              <div className="space-y-3">
                {["Branco", "Azul", "Roxo", "Rosa", "Café", "Branco Lilás", "Salmão", "Floral"].map(color => (
                  <label key={color} className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-slate-200 bg-transparent text-slate-900 focus:ring-slate-200 transition-all"
                      checked={selectedFilters.color.includes(color)}
                      onChange={() => toggleFilter('color', color)}
                    />
                    <span className="text-sm text-slate-500 group-hover:text-slate-900 transition-all">{color}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Tamanho Roupas */}
            <div>
              <h4 className="font-black text-[10px] uppercase tracking-widest mb-5 text-slate-400">Tamanho Roupas</h4>
              <div className="flex flex-wrap gap-2">
                {CLOTHING_SIZES.map(size => (
                  <button
                    key={size}
                    onClick={() => toggleFilter('size', size)}
                    className={`w-10 h-10 flex items-center justify-center rounded-md border text-[10px] font-black transition-all ${selectedFilters.size.includes(size) ? 'bg-slate-900 text-white border-slate-900' : 'border-slate-200 text-slate-400 hover:border-slate-900'}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Tamanho Chinelos */}
            <div>
              <h4 className="font-black text-[10px] uppercase tracking-widest mb-5 text-slate-400">Tamanho Chinelos</h4>
              <div className="flex flex-wrap gap-2">
                {FOOTWEAR_SIZES.map(size => (
                  <button
                    key={size}
                    onClick={() => toggleFilter('size', size)}
                    className={`w-12 h-10 flex items-center justify-center rounded-md border text-[10px] font-black transition-all ${selectedFilters.size.includes(size) ? 'bg-slate-900 text-white border-slate-900' : 'border-slate-200 text-slate-400 hover:border-slate-900'}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* --- Product Grid --- */}
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-12 gap-4">
            <div className="flex items-center gap-4">
              <h2 className="text-2xl md:text-3xl font-black tracking-tight text-slate-900 uppercase">Produtos</h2>
              <button 
                onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
                className="md:hidden flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-md text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all"
              >
                <Filter className="w-3 h-3" />
                {isMobileFilterOpen ? 'Fechar Filtros' : 'Filtros'}
              </button>
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{filteredProducts.length} itens encontrados</p>
          </div>

          {/* Mobile Filter Content */}
          <AnimatePresence>
            {isMobileFilterOpen && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="md:hidden overflow-hidden mb-12 border-b border-slate-100 pb-12"
              >
                <div className="grid grid-cols-2 gap-10">
                  <div>
                    <h4 className="font-black text-[10px] uppercase tracking-widest mb-5 text-slate-400">Tipo</h4>
                    <div className="space-y-3">
                      {["Roupas", "Chinelos"].map(cat => (
                        <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                          <input
                            type="checkbox"
                            className="w-4 h-4 rounded border-slate-200 bg-transparent text-slate-900 focus:ring-slate-200 transition-all"
                            checked={selectedFilters.category.includes(cat)}
                            onChange={() => toggleFilter('category', cat)}
                          />
                          <span className="text-sm text-slate-500 group-hover:text-slate-900 transition-all">{cat}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-black text-[10px] uppercase tracking-widest mb-5 text-slate-400">Cor</h4>
                    <div className="space-y-3">
                      {["Branco", "Azul", "Roxo", "Rosa", "Café", "Branco Lilás", "Salmão", "Floral"].map(color => (
                        <label key={color} className="flex items-center gap-3 cursor-pointer group">
                          <input
                            type="checkbox"
                            className="w-4 h-4 rounded border-slate-200 bg-transparent text-slate-900 focus:ring-slate-200 transition-all"
                            checked={selectedFilters.color.includes(color)}
                            onChange={() => toggleFilter('color', color)}
                          />
                          <span className="text-sm text-slate-500 group-hover:text-slate-900 transition-all">{color}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="col-span-2">
                    <h4 className="font-black text-[10px] uppercase tracking-widest mb-5 text-slate-400">Tamanho Roupas</h4>
                    <div className="flex flex-wrap gap-2 mb-6">
                      {CLOTHING_SIZES.map(size => (
                        <button
                          key={size}
                          onClick={() => toggleFilter('size', size)}
                          className={`w-10 h-10 flex items-center justify-center rounded-md border text-[10px] font-black transition-all ${selectedFilters.size.includes(size) ? 'bg-slate-900 text-white border-slate-900' : 'border-slate-200 text-slate-400 hover:border-slate-900'}`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                    <h4 className="font-black text-[10px] uppercase tracking-widest mb-5 text-slate-400">Tamanho Chinelos</h4>
                    <div className="flex flex-wrap gap-2">
                      {FOOTWEAR_SIZES.map(size => (
                        <button
                          key={size}
                          onClick={() => toggleFilter('size', size)}
                          className={`w-12 h-10 flex items-center justify-center rounded-md border text-[10px] font-black transition-all ${selectedFilters.size.includes(size) ? 'bg-slate-900 text-white border-slate-900' : 'border-slate-200 text-slate-400 hover:border-slate-900'}`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <button 
                  onClick={clearFilters}
                  className="mt-8 text-[10px] font-black uppercase tracking-widest text-red-500 hover:text-red-600 transition-colors"
                >
                  Limpar todos os filtros
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-16">
            {paginatedProducts.map((product: any) => (
              <motion.div
                layout
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="group relative flex flex-col"
              >
                <Link to={`/product/${product.id}`} className="block aspect-[4/5] rounded-md overflow-hidden bg-slate-50 mb-8 relative shadow-sm group-hover:shadow-2xl group-hover:shadow-slate-200/50 transition-all duration-500">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-out"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  {/* Quick Actions Overlay */}
                  <div className="absolute top-4 right-4 flex flex-col gap-3 translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500 z-10">
                    <button 
                      onClick={(e) => { e.preventDefault(); toggleFavorite(product.id); }}
                      className={`w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center transition-all hover:scale-110 hover:bg-white ${favorites.includes(product.id) ? 'text-red-500' : 'text-slate-400'}`}
                      title="Favoritar"
                    >
                      <Heart className={`w-4 h-4 ${favorites.includes(product.id) ? 'fill-current' : ''}`} />
                    </button>
                    <button 
                      onClick={(e) => { e.preventDefault(); navigate(`/product/${product.id}`); }}
                      className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center text-slate-900 transition-all hover:scale-110 hover:bg-white"
                      title="Visualizar"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={(e) => { e.preventDefault(); addToCart(product); }}
                      className="w-10 h-10 rounded-full bg-slate-900 text-white shadow-lg flex items-center justify-center transition-all hover:scale-110 hover:bg-black"
                      title="Adicionar ao Carrinho"
                    >
                      <ShoppingCart className="w-4 h-4" />
                    </button>
                  </div>
                </Link>

                <div className="px-2">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{product.category}</p>
                      <h3 className="font-black text-slate-900 text-lg tracking-tight leading-tight group-hover:text-slate-600 transition-colors uppercase">{product.name}</h3>
                    </div>
                  </div>
                  <div className="flex items-center mt-4 pt-4 border-t border-slate-100">
                    <p className="text-xl font-black text-slate-900 tracking-tighter">R$ {product.price.toFixed(2).replace('.', ',')}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-20 flex flex-wrap items-center justify-center gap-4">
              <button 
                onClick={() => setCurrentPage((prev: number) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="p-3 rounded-md border border-slate-200 text-slate-400 hover:text-slate-900 disabled:opacity-30 transition-all"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div className="flex gap-2">
                {[...Array(totalPages)].map((_, i) => {
                  const page = i + 1;
                  return (
                    <button 
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-10 h-10 flex items-center justify-center rounded-md text-xs font-black transition-all ${currentPage === page ? 'bg-slate-900 text-white' : 'text-slate-400 hover:text-slate-900'}`}
                    >
                      {page}
                    </button>
                  );
                })}
              </div>
              <button 
                onClick={() => setCurrentPage((prev: number) => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="p-3 rounded-md border border-slate-200 text-slate-400 hover:text-slate-900 disabled:opacity-30 transition-all"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </main>
    </>
  );
}

function ProductDetail({ addToCart, toggleFavorite, favorites }: any) {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = PRODUCTS.find(p => p.id === Number(id));
  const [selectedColor, setSelectedColor] = useState(product?.color || "#18181b");
  const [selectedSize, setSelectedSize] = useState(product?.size || "40/41");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!product) return <div className="p-20 text-center">Produto não encontrado</div>;

  return (
    <main className="max-w-7xl mx-auto px-4 py-12 md:py-20 flex-1">
      <button 
        onClick={() => navigate('/')}
        className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 mb-12 transition-all group"
      >
        <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Voltar para a loja
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-24">
        <div className="space-y-6">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="aspect-[4/5] rounded-lg overflow-hidden bg-slate-50 border border-slate-100 shadow-sm"
          >
            <img 
              src={product.image} 
              alt={product.name} 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </motion.div>
        </div>

        <div className="flex flex-col">
          <div className="mb-10">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-4 block">
              {product.category}
            </span>
            <h2 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 uppercase tracking-tighter leading-[0.9]">
              {product.name}
            </h2>
            <div className="flex items-center gap-4 mb-8">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-4 h-4 ${i < product.rating ? 'fill-slate-900 text-slate-900' : 'text-slate-200'}`} />
                ))}
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">128 avaliações</span>
            </div>
            <p className="text-4xl font-black text-slate-900 tracking-tighter">
              R$ {product.price.toFixed(2).replace('.', ',')}
            </p>
          </div>

          <div className="space-y-10 mb-12">
            <div>
              <h4 className="font-black text-[10px] uppercase tracking-[0.2em] mb-4 text-slate-400">Cores</h4>
              <div className="flex gap-4">
                {["#18181b", "#f8fafc", "#4f46e5", "#10b981"].map(c => (
                  <button 
                    key={c} 
                    onClick={() => setSelectedColor(c)}
                    className={`w-10 h-10 rounded-full border-2 transition-all hover:scale-110 flex items-center justify-center ${selectedColor === c ? 'border-slate-900 ring-2 ring-slate-900 ring-offset-2' : 'border-transparent shadow-sm'}`} 
                    style={{ backgroundColor: c }}
                  >
                    {selectedColor === c && (
                      <div className={`w-2 h-2 rounded-full ${c === '#f8fafc' ? 'bg-slate-900' : 'bg-white'}`} />
                    )}
                  </button>
                ))}
              </div>
              {selectedColor && (
                <p className="mt-3 text-[10px] font-bold uppercase tracking-widest text-slate-900">
                  Cor selecionada: <span className="text-slate-400">{selectedColor === '#18181b' ? 'Preto' : selectedColor === '#f8fafc' ? 'Branco' : selectedColor === '#4f46e5' ? 'Azul' : 'Verde'}</span>
                </p>
              )}
            </div>

            <div>
              <h4 className="font-black text-[10px] uppercase tracking-[0.2em] mb-4 text-slate-400">Tamanho</h4>
              <div className="flex flex-wrap gap-2">
                {(product.category === "Chinelos" ? FOOTWEAR_SIZES : CLOTHING_SIZES).map(s => (
                  <button 
                    key={s} 
                    onClick={() => setSelectedSize(s)}
                    className={`w-12 h-12 rounded-md border text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center ${s === selectedSize ? 'bg-slate-900 text-white border-slate-900' : 'border-slate-200 text-slate-400 hover:border-slate-900'}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
              {selectedSize && (
                <p className="mt-3 text-[10px] font-bold uppercase tracking-widest text-slate-900">
                  Tamanho selecionado: <span className="text-slate-400">{selectedSize}</span>
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mt-auto">
            <button 
              onClick={() => addToCart({ ...product, color: selectedColor, size: selectedSize })}
              className="flex-1 bg-slate-900 text-white py-5 rounded-md font-black text-xs uppercase tracking-[0.2em] transition-all shadow-2xl shadow-slate-900/20 hover:scale-[1.02] flex items-center justify-center gap-3"
            >
              <ShoppingCart className="w-5 h-5" />
              Adicionar ao Carrinho
            </button>
            <button 
              onClick={() => toggleFavorite(product.id)}
              className={`p-5 rounded-md border transition-all ${favorites.includes(product.id) ? 'bg-red-50 border-red-100 text-red-500' : 'border-slate-200 text-slate-400 hover:text-red-500'}`}
            >
              <Heart className={`w-6 h-6 ${favorites.includes(product.id) ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      <section className="mt-40">
        <div className="flex items-center justify-between mb-12">
          <h3 className="text-2xl font-black uppercase tracking-tight">Relacionados</h3>
          <Link to="/" className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-all">Ver tudo</Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {PRODUCTS.slice(0, 4).map(p => (
            <div key={p.id} className="group cursor-pointer flex flex-col" onClick={() => navigate(`/product/${p.id}`)}>
              <div className="aspect-[4/5] rounded-md overflow-hidden bg-slate-50 mb-6 relative shadow-sm group-hover:shadow-xl transition-all duration-500">
                <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="px-1">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{p.category}</p>
                <h4 className="font-black text-slate-900 text-sm mb-2 uppercase tracking-tight">{p.name}</h4>
                <p className="text-base font-black text-slate-900 tracking-tighter">R$ {p.price.toFixed(2).replace('.', ',')}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
