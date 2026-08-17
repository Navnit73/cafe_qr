"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Mail, Lock, AlertCircle, CheckCircle2, Eye, EyeOff, ArrowRight } from "lucide-react";

const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters"),
  rememberMe: z.boolean(),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export interface LoginFormProps {
  onSuccess?: (data: LoginFormData) => void;
}

export function LoginForm({ onSuccess }: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setFormError(null);
    setIsSuccess(false);

    try {
      // Simulate network authentication request
      await new Promise((resolve) => setTimeout(resolve, 800));

      if (data.email === "error@example.com") {
        setFormError("Invalid email or password. Please check your credentials and try again.");
        return;
      }

      setIsSuccess(true);
      if (onSuccess) {
        onSuccess(data);
      }
    } catch {
      setFormError("An unexpected error occurred. Please try again later.");
    }
  };

  const handleInputChange = () => {
    if (formError) {
      setFormError(null);
    }
  };

  return (
    <div className="card w-full bg-surface-1 border border-hairline rounded-xl shadow-none">
      <div className="card-body p-6 sm:p-8">
        <div className="mb-4">
          <h2 className="text-xl sm:text-2xl font-medium tracking-tight text-ink">
            Sign in to your account
          </h2>
          <p className="text-sm text-ink-muted mt-1">
            Welcome back! Please enter your details.
          </p>
        </div>

        {formError && (
          <div
            role="alert"
            aria-live="assertive"
            className="alert alert-error text-xs rounded-lg py-2.5 px-3 mb-3 flex items-start gap-2"
          >
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{formError}</span>
          </div>
        )}

        {isSuccess && (
          <div
            role="alert"
            aria-live="polite"
            className="alert alert-success text-xs rounded-lg py-2.5 px-3 mb-3 flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Signed in successfully! Redirecting...</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          {/* Email Field */}
          <fieldset className="fieldset w-full">
            <legend className="fieldset-legend text-xs font-medium text-ink mb-1.5">
              Email address
            </legend>
            <div
              className={`flex items-center w-full px-3 py-2.5 bg-surface-1 border rounded-lg transition-all ${
                errors.email
                  ? "border-semantic-error ring-1 ring-semantic-error"
                  : "border-hairline focus-within:border-ink focus-within:ring-1 focus-within:ring-ink"
              }`}
            >
              <Mail className="w-4 h-4 text-ink-subtle mr-2.5 shrink-0" />
              <input
                id="email-input"
                type="email"
                placeholder="name@company.com"
                disabled={isSubmitting}
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? "email-error" : undefined}
                className="w-full bg-transparent text-sm text-ink placeholder:text-ink-tertiary focus:outline-none disabled:opacity-60"
                autoComplete="email"
                {...register("email", { onChange: handleInputChange })}
              />
            </div>
            {errors.email && (
              <p id="email-error" role="alert" className="text-xs text-semantic-error mt-1">
                {errors.email.message}
              </p>
            )}
          </fieldset>

          {/* Password Field */}
          <fieldset className="fieldset w-full">
            <div className="flex items-center justify-between mb-1.5">
              <legend className="fieldset-legend text-xs font-medium text-ink">
                Password
              </legend>
              <a
                href="#forgot-password"
                className="text-xs text-ink-muted hover:text-ink hover:underline font-medium"
              >
                Forgot password?
              </a>
            </div>
            <div
              className={`flex items-center w-full px-3 py-2.5 bg-surface-1 border rounded-lg transition-all ${
                errors.password
                  ? "border-semantic-error ring-1 ring-semantic-error"
                  : "border-hairline focus-within:border-ink focus-within:ring-1 focus-within:ring-ink"
              }`}
            >
              <Lock className="w-4 h-4 text-ink-subtle mr-2.5 shrink-0" />
              <input
                id="password-input"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                disabled={isSubmitting}
                aria-invalid={!!errors.password}
                aria-describedby={errors.password ? "password-error" : undefined}
                className="w-full bg-transparent text-sm text-ink placeholder:text-ink-tertiary focus:outline-none disabled:opacity-60"
                autoComplete="current-password"
                {...register("password", { onChange: handleInputChange })}
              />
              <button
                type="button"
                tabIndex={0}
                disabled={isSubmitting}
                className="text-ink-subtle hover:text-ink ml-2 focus:outline-none p-0.5 rounded cursor-pointer disabled:opacity-50"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                aria-pressed={showPassword}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            {errors.password && (
              <p id="password-error" role="alert" className="text-xs text-semantic-error mt-1">
                {errors.password.message}
              </p>
            )}
          </fieldset>

          {/* Remember Me Checkbox */}
          <div className="flex items-center gap-2 pt-1">
            <input
              id="remember-me-checkbox"
              type="checkbox"
              disabled={isSubmitting}
              className="checkbox checkbox-sm checkbox-primary rounded cursor-pointer disabled:opacity-60"
              {...register("rememberMe")}
            />
            <label
              htmlFor="remember-me-checkbox"
              className="text-xs text-ink-muted cursor-pointer select-none"
            >
              Remember me for 30 days
            </label>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              id="login-submit-btn"
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary w-full rounded-lg text-sm font-medium tracking-normal h-11 min-h-11 normal-case shadow-none cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <span className="loading loading-spinner loading-xs" />
                  <span>Signing in...</span>
                </>
              ) : (
                <span className="flex items-center justify-center gap-1.5">
                  <span>Sign in</span>
                  <ArrowRight className="w-4 h-4" />
                </span>
              )}
            </button>
          </div>
        </form>

        <div className="text-center pt-4 border-t border-hairline-soft mt-5">
          <p className="text-xs text-ink-muted">
            Don&apos;t have an account?{" "}
            <a href="#sign-up" className="text-ink font-medium hover:underline">
              Start a 14-day free trial
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
