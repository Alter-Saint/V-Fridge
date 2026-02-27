"use client";

import { useEffect, useState } from "react";
import { useProductStore } from "@/store/useVFridgeStore";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Trash2, Edit2, Check, X, Loader2, Refrigerator } from "lucide-react";
import { getErrorMessage } from "@/lib/utils";
export function ProductList() {
  const { products, setProducts, removeProduct, updateProduct } = useProductStore();
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");

  // Завантаження списку при монтуванні
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

  // Видалення продукту
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

  // Збереження оновленої кількості
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
      <div className="flex flex-col items-center justify-center py-10 gap-2">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Заглядаємо в холодильник...</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12 border-2 border-dashed rounded-xl">
        <Refrigerator className="mx-auto h-12 w-12 text-muted-foreground/20 mb-4" />
        <p className="text-muted-foreground">У холодильнику порожньо</p>
      </div>
    );
  }

  return (
  <div className="space-y-4">
    {products.map((product) => {
      const isExpired = product.expiryDate && new Date(product.expiryDate) < new Date();
      
      return (
        <Card key={product.id} className={`overflow-hidden transition-all ${isExpired ? 'border-destructive/50 bg-destructive/5' : ''}`}>
          <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            
            {/* Секція інформації */}
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-bold text-lg leading-tight">{product.name}</h3>
                {isExpired && <Badge variant="destructive" className="h-5 animate-pulse">Протерміновано</Badge>}
              </div>
              
              <div className="flex flex-col gap-0.5">
                 <p className="text-xs text-muted-foreground">
                   Вжити до: {product.expiryDate ? new Date(product.expiryDate).toLocaleDateString('uk-UA') : "Не вказано"}
                 </p>
                 {product.description && (
                   <p className="text-sm text-muted-foreground italic line-clamp-2">{product.description}</p>
                 )}
              </div>
            </div>

            {/* Секція кнопок керування */}
            <div className="flex items-center justify-between sm:justify-end gap-3 border-t sm:border-none pt-3 sm:pt-0">
              
              <div className="flex items-center gap-3">
                {editingId === product.id ? (
                  <div className="flex items-center gap-1 bg-background p-1 border rounded-lg shadow-sm">
                    <Input 
                      type="number" 
                      className="w-20 h-9 border-none focus-visible:ring-0 text-base" 
                      value={editValue} 
                      onChange={(e) => setEditValue(e.target.value)} 
                      autoFocus
                    />
                    <Button size="icon" variant="ghost" className="h-9 w-9" onClick={() => handleSaveQty(product.id)}>
                      <Check className="h-5 w-5 text-green-600" />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-9 w-9" onClick={() => setEditingId(null)}>
                      <X className="h-5 w-5 text-destructive" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-base bg-secondary/50 px-3 py-1 rounded-md">
                      {product.quantity} <span className="text-xs font-normal text-muted-foreground">{product.unit}</span>
                    </span>
                    <Button 
                      size="icon" 
                      variant="outline" 
                      className="h-10 w-10 sm:h-9 sm:w-9 shadow-sm" 
                      onClick={() => { 
                        setEditingId(product.id); 
                        setEditValue(String(product.quantity)); 
                      }}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
              
              <Button 
                size="icon" 
                variant="ghost" 
                className="h-10 w-10 sm:h-9 sm:w-9 text-muted-foreground hover:text-destructive hover:bg-destructive/10" 
                onClick={() => handleDelete(product.id)}
              >
                <Trash2 className="h-5 w-5" />
              </Button>
            </div>
            
          </CardContent>
        </Card>
      );
    })}
  </div>
);
}