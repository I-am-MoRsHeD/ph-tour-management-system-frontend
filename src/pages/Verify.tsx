/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { cn } from "@/lib/utils";
import { useSendOtpMutation, useVerifyOtpMutation } from "@/redux/features/auth/auth.api";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dot } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router";
import { toast } from "sonner";
import z from "zod";

const FormSchema = z.object({
    otp: z.string().min(6, {
        message: "Your one-time password must be 6 characters.",
    }),
});

const Verify = () => {
    const [sendOtp] = useSendOtpMutation();
    const [verifyOtp] = useVerifyOtpMutation();
    const { state } = useLocation() as { state: string };;
    const navigate = useNavigate();
    const [email] = useState(state);
    const [confirmed, setConfirmed] = useState(false);
    const [timer, setTimer] = useState(120);
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            otp: "",
        },
    })

    const handleSendOTP = async () => {
        const toastId = toast.loading('Sending OTP');
        try {
            const res = await sendOtp({ email: email }).unwrap();
            if (res.statusCode === 200) {
                toast.success(res.message, { id: toastId });
                setConfirmed(true);
                setTimer(120);
            }
        } catch (error: any) {
            console.log(error);
            toast.error(error.data.message);
        }
    }

    const onSubmit = async (data: z.infer<typeof FormSchema>) => {
        const toastId = toast.loading('Verifying OTP');
        const userInfo = {
            email,
            otp: data.otp
        };

        try {
            const res = await verifyOtp(userInfo).unwrap();
            if (res.statusCode === 200) {
                toast.success(res.message, { id: toastId });
                navigate('/login');
            }
        } catch (error: any) {
            console.log(error);
            toast.error(error.data.message);
        }
    };

    useEffect(() => {
        if (!email) {
            navigate('/login');
        }
        if (!confirmed) {
            return;
        };

        const timerId = setInterval(() => {
            setTimer((prev) => prev > 0 ? prev - 1 : 0);
            console.log('tick');
        }, 1000);

        return () => clearInterval(timerId);
    }, [email, confirmed]);


    return (
        <div className="grid place-content-center h-screen">
            {
                confirmed ? (
                    <Card className="w-full max-w-sm">
                        <CardHeader>
                            <CardTitle>Varify your email address</CardTitle>
                            <CardDescription>
                                Please enter the 6-digit code we sent to
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="w-full">
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
                                    <FormField
                                        control={form.control}
                                        name="otp"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <InputOTP maxLength={6} {...field}>
                                                        <InputOTPGroup>
                                                            <InputOTPSlot index={0} />
                                                        </InputOTPGroup>
                                                        <InputOTPGroup>
                                                            <InputOTPSlot index={1} />
                                                        </InputOTPGroup>
                                                        <InputOTPGroup>
                                                            <InputOTPSlot index={2} />
                                                        </InputOTPGroup>
                                                        <Dot />
                                                        <InputOTPGroup>
                                                            <InputOTPSlot index={3} />
                                                        </InputOTPGroup>
                                                        <InputOTPGroup>
                                                            <InputOTPSlot index={4} />
                                                        </InputOTPGroup>
                                                        <InputOTPGroup>
                                                            <InputOTPSlot index={5} />
                                                        </InputOTPGroup>
                                                    </InputOTP>
                                                </FormControl>
                                                <FormDescription>
                                                    <Button
                                                        type="button"
                                                        variant="link"
                                                        onClick={handleSendOTP}
                                                        disabled={timer > 0}
                                                        className={cn("p-0 m-0", {
                                                            "text-gray-600": timer > 0,
                                                            "cursor-pointer": timer <= 0
                                                        })}
                                                    >
                                                        Resend OTP : {" "}
                                                    </Button>
                                                    {" "}{timer}
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <Button className="w-full" type="submit">Submit</Button>
                                </form>
                            </Form>
                        </CardContent>
                    </Card>
                ) : (
                    <Card className="w-full max-w-sm">
                        <CardHeader>
                            <CardTitle>Varify your email address</CardTitle>
                            <CardDescription>
                                We will send an OTP at <br />
                                {email}
                            </CardDescription>
                        </CardHeader>
                        <CardFooter>
                            <Button onClick={handleSendOTP} className="w-[300px]" type="submit">Confirm</Button>
                        </CardFooter>
                    </Card>
                )
            }
        </div>
    );
};

export default Verify;