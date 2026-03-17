"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { useProductStore } from "@/store/useVFridgeStore";
import { productSchema } from "@/interfaces/schemas";
import { getErrorMessage } from "@/lib/utils";

export function AddProducts() {
  const { data: session } = useSession();
  const addProductToStore = useProductStore((state) => state.addProduct);
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    quantity: "1",
    unit: "шт",
    expiryDate: ""
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!session?.user?.id) {
      alert("Ви не авторизовані. Спробуйте перелогінитись.");
      return;
    }
    const selectedDate = new Date(formData.expiryDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      const confirmAdd = confirm("⚠️ Продукт вже протермінований. Ти впевнений, що хочеш його додати?");
      if (!confirmAdd) return;
    }
    
    setIsLoading(true);

    const payload = {
      name: formData.name,
      description: formData.description || null,
      quantity: Number(formData.quantity),
      unit: formData.unit,
      expiryDate: formData.expiryDate,
      ownerId: String(session.user.id),
    };

    const validation = productSchema.safeParse(payload);
    
    if (!validation.success) {
      const firstError = validation.error.issues[0]?.message || "Помилка валідації";
      alert(firstError);
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Server error");
      }

      const savedProduct = await response.json();
      addProductToStore(savedProduct);
      setIsOpen(false);
      setFormData({ name: "", description: "", quantity: "1", unit: "шт", expiryDate: "" });
    } 
    catch (error) {
  alert(getErrorMessage(error) || "Не вдалося додати продукт");
}
    finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>Add Product</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add New Product</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleAdd}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">Name</Label>
              <Input id="name" className="col-span-3" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="quantity" className="text-right">Quantity</Label>
              <div className="col-span-3 flex gap-2">
                <Input id="quantity" type="number" step="0.1" className="flex-1" value={formData.quantity} onChange={(e) => setFormData({...formData, quantity: e.target.value})} required />
                <Select value={formData.unit} onValueChange={(v) => setFormData({...formData, unit: v})}>
                  <SelectTrigger className="w-25"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="шт">шт</SelectItem>
                    <SelectItem value="кг">кг</SelectItem>
                    <SelectItem value="л">л</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="expiryDate" className="text-right">Expiry</Label>
              <Input id="expiryDate" type="date" className="col-span-3" value={formData.expiryDate} onChange={(e) => setFormData({...formData, expiryDate: e.target.value})} required />
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Add Product
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}