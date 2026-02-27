'use client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useSession, signOut } from "next-auth/react";
import { Trash2, LogOut, ShieldCheck } from "lucide-react";
import { toast } from "sonner"; // або твій toast

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
        <div className="p-8 max-w-4xl mx-auto space-y-8">
            <header>
                <h1 className="text-3xl font-bold tracking-tight">Налаштування</h1>
                <p className="text-muted-foreground">Керуйте вашим профілем та даними V-Fridge.</p>
            </header>

            <Separator />

            <div className="grid gap-6">
                {/* Profile Section */}
                <Card>
                    <CardHeader>
                        <CardTitle>Профіль</CardTitle>
                        <CardDescription>Ваша публічна інформація</CardDescription>
                    </CardHeader>
                    <CardContent className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <p className="text-xs font-medium text-muted-foreground uppercase">Юзернейм</p>
                            <p className="text-xl font-semibold">{session?.user?.username || "Гість"}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-xs font-medium text-muted-foreground uppercase">Email</p>
                            <p className="text-lg text-muted-foreground">{session?.user?.email || "Не вказано"}</p>
                        </div>
                    </CardContent>
                </Card>

                {/* Data Management Section */}
                <Card className="border-destructive/20">
                    <CardHeader>
                        <CardTitle>Керування даними</CardTitle>
                        <CardDescription>Очищення вашої активності (незворотна дія)</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-wrap gap-4">
                        <Button 
                            variant="outline" 
                            className="text-destructive hover:bg-destructive/10"
                            onClick={() => clearData('products')}
                        >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Очистити холодильник
                        </Button>
                        <Button 
                            variant="outline" 
                            className="text-destructive hover:bg-destructive/10"
                            onClick={() => clearData('chat')}
                        >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Видалити історію чату
                        </Button>
                    </CardContent>
                </Card>

                {/* Account Actions */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <ShieldCheck className="h-5 w-5 text-primary" />
                            Акаунт
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex justify-between items-center">
                        <p className="text-sm text-muted-foreground">
                            {session ? "Сесія активна" : "Ви не увійшли"}
                        </p>
                        <Button variant="destructive" onClick={() => signOut({ callbackUrl: '/signin' })}>
                            <LogOut className="mr-2 h-4 w-4" />
                            Вийти з акаунту
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}