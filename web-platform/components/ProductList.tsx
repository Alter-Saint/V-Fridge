'use client';

import { useEffect, useState } from "react";
import { useProductStore } from "@/store/useVFridgeStore";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Trash2, Edit2, Check, X, Loader2, Refrigerator, CalendarDays } from "lucide-react";
import { getErrorMessage } from "@/lib/utils";

export function ProductList() {
  const { products, setProducts, removeProduct, updateProduct } = useProductStore();
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");

  useEffect(() => {
    async function loadProducts() {
      try {
        const res = await fetch("/api/products");
        if (res.ok) {
          const data = await res.json();
          setProducts(data);
        }
      } catch (error) {
        console.error("Помилка завантаження продуктів:", error);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, [setProducts]);

  const handleDelete = async (id: number) => {
    if (!confirm("Видалити цей продукт?")) return;
    
    try {
      const res = await fetch(`/api/products?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        removeProduct(id);
      } else {
        alert("Не вдалося видалити продукт на сервері");
      }
    } catch (err) {
      alert(getErrorMessage(err));
    }
  };

  const handleSaveQty = async (id: number) => {
    try {
      const res = await fetch("/api/products", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, quantity: Number(editValue) }),
      });
      
      if (res.ok) {
        const updated = await res.json();
        updateProduct(updated);
        setEditingId(null);
      }
    } catch (err) {
      alert(getErrorMessage(err));
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="relative">
            <Loader2 className="h-12 w-12 animate-spin text-primary opacity-20" />
            <Refrigerator className="h-6 w-6 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        </div>
        <p className="text-sm font-medium text-muted-foreground animate-pulse">Заглядаємо в холодильник...</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-20 border-4 border-dashed rounded-[2rem] bg-muted/5">
        <div className="bg-background w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
            <Refrigerator className="h-10 w-10 text-muted-foreground/40" />
        </div>
        <h3 className="text-xl font-bold">Холодильник порожній</h3>
        <p className="text-muted-foreground max-w-50 mx-auto mt-2">Час додати перші продукти для контролю</p>
      </div>
    );
  }

  return (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
    {products.map((product) => {
      const isExpired = product.expiryDate && new Date(product.expiryDate) < new Date();
      
      return (
        <Card key={product.id} className={`group relative overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 border-none bg-card shadow-lg ${isExpired ? 'ring-2 ring-destructive/50' : ''}`}>
          {isExpired && (
            <div className="absolute top-0 left-0 w-full h-1 bg-destructive animate-pulse" />
          )}
          
          <CardContent className="p-5 flex flex-col h-full justify-between gap-6">
            
            <div className="space-y-3">
              <div className="flex justify-between items-start gap-2">
                <div className="space-y-1">
                    <h3 className="font-black text-xl tracking-tight line-clamp-1">{product.name}</h3>
                    {isExpired ? (
                        <Badge variant="destructive" className="rounded-full px-3 py-0 text-[10px] uppercase font-black tracking-widest">Expired</Badge>
                    ) : (
                        <Badge variant="secondary" className="rounded-full px-3 py-0 text-[10px] uppercase font-black tracking-widest bg-green-500/10 text-green-600 border-none">Fresh</Badge>
                    )}
                </div>
                
                <Button 
                    size="icon" 
                    variant="ghost" 
                    className="h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/10 hover:text-destructive" 
                    onClick={() => handleDelete(product.id)}
                >
                    <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex items-center gap-2 text-muted-foreground">
                 <CalendarDays className="h-4 w-4 shrink-0" />
                 <p className="text-xs font-semibold uppercase tracking-tighter">
                   {product.expiryDate ? new Date(product.expiryDate).toLocaleDateString('uk-UA') : "No Date"}
                 </p>
              </div>

              {product.description && (
                <p className="text-sm text-muted-foreground/80 line-clamp-2 leading-relaxed bg-muted/30 p-2 rounded-lg italic">
                    {product.description}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between mt-auto pt-4 border-t border-muted">
              {editingId === product.id ? (
                <div className="flex items-center gap-2 w-full">
                  <Input 
                    type="number" 
                    className="h-10 border-primary/20 focus-visible:ring-primary font-bold" 
                    value={editValue} 
                    onChange={(e) => setEditValue(e.target.value)} 
                    autoFocus
                  />
                  <Button size="icon" className="h-10 w-10 shrink-0" onClick={() => handleSaveQty(product.id)}>
                    <Check className="h-5 w-5" />
                  </Button>
                  <Button size="icon" variant="outline" className="h-10 w-10 shrink-0" onClick={() => setEditingId(null)}>
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              ) : (
                <>
                    <div className="flex flex-col">
                        <span className="text-[10px] uppercase font-black text-muted-foreground tracking-widest">Quantity</span>
                        <div className="flex items-baseline gap-1">
                            <span className="text-2xl font-black italic">{product.quantity}</span>
                            <span className="text-xs font-bold text-muted-foreground uppercase">{product.unit}</span>
                        </div>
                    </div>
                    <Button 
                      variant="secondary"
                      size="sm"
                      className="rounded-xl font-bold h-10 px-4 gap-2 hover:bg-primary hover:text-primary-foreground transition-colors"
                      onClick={() => { 
                        setEditingId(product.id); 
                        setEditValue(String(product.quantity)); 
                      }}
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                      Edit
                    </Button>
                </>
              )}
            </div>
            
          </CardContent>
        </Card>
      );
    })}
  </div>
);
}