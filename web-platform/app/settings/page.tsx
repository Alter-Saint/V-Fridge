'use client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useSession, signOut } from "next-auth/react";
import { Trash2, LogOut, ShieldCheck, User } from "lucide-react";
import { toast } from "sonner";

export default function Settings() {
    const { data: session } = useSession();

    const clearData = async (type: 'chat' | 'products') => {
        if (!confirm(`Ви впевнені, що хочете видалити всі ${type === 'chat' ? 'повідомлення' : 'продукти'}?`)) return;

        try {
            const res = await fetch(`/api/${type}`, { method: 'DELETE' });
            if (res.ok) {
                toast.success(`${type === 'chat' ? 'Чат' : 'Холодильник'} очищено`);
            } else {
                throw new Error();
            }
        } catch (error) {
            toast.error("Не вдалося виконати дію");
        }
    };

    return (
        <div className="min-h-screen w-full bg-background p-4 md:p-8 lg:p-12">
            <div className="max-w-5xl mx-auto space-y-10">
                <header className="space-y-2">
                    <h1 className="text-4xl md:text-5xl font-black tracking-tighter">Налаштування</h1>
                    <p className="text-lg text-muted-foreground font-medium">Керуйте вашим профілем та даними V-Fridge.</p>
                </header>

                <Separator className="bg-primary/10" />

                <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                    <section className="md:col-span-4 space-y-4">
                        <div className="p-6 rounded-2xl bg-muted/30 border border-dashed flex flex-col items-center text-center space-y-4">
                            <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center border-4 border-background shadow-sm">
                                <User className="h-10 w-10 text-primary" />
                            </div>
                            <div>
                                <h3 className="font-bold text-xl">{session?.user?.username || "Гість"}</h3>
                                <p className="text-sm text-muted-foreground">{session?.user?.email || "Email не вказано"}</p>
                            </div>
                        </div>
                    </section>

                    <main className="md:col-span-8 space-y-6">
                        <Card className="rounded-2xl border-none shadow-xl bg-card overflow-hidden">
                            <CardHeader className="bg-muted/30 pb-4">
                                <CardTitle className="text-xl">Персональні дані</CardTitle>
                                <CardDescription>Інформація вашого облікового запису</CardDescription>
                            </CardHeader>
                            <CardContent className="pt-6 grid sm:grid-cols-2 gap-8">
                                <div className="space-y-1 p-4 rounded-xl bg-secondary/20 border border-secondary/50">
                                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Юзернейм</p>
                                    <p className="text-lg font-bold">{session?.user?.username || "Гість"}</p>
                                </div>
                                <div className="space-y-1 p-4 rounded-xl bg-secondary/20 border border-secondary/50">
                                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Email адреса</p>
                                    <p className="text-lg font-bold truncate">{session?.user?.email || "—"}</p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="rounded-2xl border-destructive/20 shadow-lg overflow-hidden">
                            <CardHeader className="bg-destructive/5 border-b border-destructive/10">
                                <CardTitle className="text-xl text-destructive">Небезпечна зона</CardTitle>
                                <CardDescription>Ці дії неможливо скасувати</CardDescription>
                            </CardHeader>
                            <CardContent className="pt-6 flex flex-col sm:flex-row gap-4">
                                <Button 
                                    variant="outline" 
                                    className="flex-1 h-12 text-destructive border-destructive/20 hover:bg-destructive hover:text-destructive-foreground transition-all"
                                    onClick={() => clearData('products')}
                                >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Очистити продукти
                                </Button>
                                <Button 
                                    variant="outline" 
                                    className="flex-1 h-12 text-destructive border-destructive/20 hover:bg-destructive hover:text-destructive-foreground transition-all"
                                    onClick={() => clearData('chat')}
                                >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Видалити чати
                                </Button>
                            </CardContent>
                        </Card>

                        <Card className="rounded-2xl border-none shadow-md bg-secondary/10">
                            <CardContent className="p-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-full bg-green-500/10">
                                        <ShieldCheck className="h-6 w-6 text-green-600" />
                                    </div>
                                    <p className="font-semibold text-sm">
                                        {session ? "Система захищена та активна" : "Авторизація відсутня"}
                                    </p>
                                </div>
                                <Button 
                                    variant="destructive" 
                                    className="w-full sm:w-auto px-8 h-12 font-bold rounded-xl shadow-lg shadow-destructive/20"
                                    onClick={() => signOut({ callbackUrl: '/signin' })}
                                >
                                    <LogOut className="mr-2 h-4 w-4" />
                                    Вийти
                                </Button>
                            </CardContent>
                        </Card>
                    </main>
                </div>
            </div>
        </div>
    );
}