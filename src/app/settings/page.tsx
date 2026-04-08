"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signOut, useSession } from "@/auth/client";
import { authClient } from "@/auth/client";
import { User, LogOut, Key, Loader2, CheckCircle2 } from "lucide-react";

export default function SettingsPage() {
    const { data: session } = useSession();
    const [userName, setUserName] = useState("");
    const [userEmail, setUserEmail] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
    const [passwordMsg, setPasswordMsg] = useState("");

    useEffect(() => {
        if (session?.user) {
            setUserName(session.user.name || "");
            setUserEmail(session.user.email || "");
        }
    }, [session]);

    const handleSaveProfile = async () => {
        if (!userName.trim()) return;
        setIsSaving(true);
        setIsSaved(false);
        try {
            await authClient.updateUser({
                name: userName.trim(),
            });
            setIsSaved(true);
            setTimeout(() => setIsSaved(false), 2000);
        } catch (error) {
            console.error("Failed to update profile:", error);
            alert("Failed to update profile");
        } finally {
            setIsSaving(false);
        }
    };

    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentPassword || !newPassword) {
            setPasswordMsg("Both fields are required");
            return;
        }
        if (newPassword.length < 8) {
            setPasswordMsg("Password must be at least 8 characters");
            return;
        }
        setIsUpdatingPassword(true);
        setPasswordMsg("");
        try {
            await authClient.changePassword({
                currentPassword,
                newPassword,
                revokeOtherSessions: true,
            });
            setPasswordMsg("Password updated successfully!");
            setCurrentPassword("");
            setNewPassword("");
        } catch (error) {
            setPasswordMsg("Failed to update password. Check your current password.");
        } finally {
            setIsUpdatingPassword(false);
        }
    };

    const handleSignOut = async () => {
        await signOut();
        window.location.href = "/auth/signin";
    };

    if (!session) {
        return <div className="flex items-center justify-center h-64">Loading...</div>;
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Settings</h1>
                <p className="text-muted-foreground mt-1">
                    Manage your account settings
                </p>
            </div>

            {/* Profile Section */}
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <User className="h-5 w-5" />
                        <CardTitle>Profile</CardTitle>
                    </div>
                    <CardDescription>
                        Update your profile information
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                            placeholder="Your name"
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            value={userEmail}
                            readOnly
                            className="bg-muted cursor-not-allowed"
                        />
                        <p className="text-xs text-muted-foreground">Email cannot be changed</p>
                    </div>
                    <Button
                        onClick={handleSaveProfile}
                        disabled={isSaving || !userName.trim()}
                    >
                        {isSaving ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Saving...
                            </>
                        ) : isSaved ? (
                            <>
                                <CheckCircle2 className="mr-2 h-4 w-4" />
                                Saved!
                            </>
                        ) : (
                            "Save Changes"
                        )}
                    </Button>
                </CardContent>
            </Card>

            {/* Security Section */}
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Key className="h-5 w-5" />
                        <CardTitle>Security</CardTitle>
                    </div>
                    <CardDescription>
                        Manage your password
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleUpdatePassword} className="space-y-4">
                        <div className="grid gap-2">
                            <Label htmlFor="current-password">Current Password</Label>
                            <Input
                                id="current-password"
                                type="password"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="new-password">New Password</Label>
                            <Input
                                id="new-password"
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                        </div>
                        {passwordMsg && (
                            <p className="text-sm text-muted-foreground">{passwordMsg}</p>
                        )}
                        <Button type="submit" disabled={isUpdatingPassword}>
                            {isUpdatingPassword ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Updating...
                                </>
                            ) : (
                                "Update Password"
                            )}
                        </Button>
                    </form>
                </CardContent>
            </Card>

            {/* Sign Out Section */}
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <LogOut className="h-5 w-5" />
                        <CardTitle>Sign Out</CardTitle>
                    </div>
                    <CardDescription>
                        Sign out from all your sessions
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Button variant="destructive" onClick={handleSignOut}>
                        Sign Out
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
