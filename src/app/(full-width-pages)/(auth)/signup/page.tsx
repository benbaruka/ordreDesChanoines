import SignUpForm from "@/components/auth/SignUpForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "E-commerce",
  description: "This is an E-commerce",
  // other metadata
};

export default function SignUp() {
  return <SignUpForm />;
}
