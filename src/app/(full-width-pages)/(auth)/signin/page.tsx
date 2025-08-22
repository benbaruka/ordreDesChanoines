import SignInForm from "@/components/auth/SignInForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "E-commerce",
  description: "This is an E-commerce",
};

export default function SignIn() {
  return <SignInForm />;
}
