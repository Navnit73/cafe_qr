"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useTranslations } from "next-intl";
import { Mail, Lock, AlertCircle, CheckCircle2, Eye, EyeOff, ArrowRight, Sparkles } from "lucide-react";

export interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface LoginFormProps {
  onSuccess?: (data: LoginFormData) => void;
}

export function LoginForm({ onSuccess }: LoginFormProps) {
  const tAuth = useTranslations("auth");
  const tVal = useTranslations("validation");

  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);

  // Dynamic Zod schema with localized validation messages
  const loginSchema = useMemo(
    () =>
      z.object({
        email: z
          .string()
          .trim()
          .min(1, tVal("emailRequired"))
          .email(tVal("emailInvalid")),
        password: z
          .string()
          .min(1, tVal("passwordRequired"))
          .min(6, tVal("passwordMin")),
        rememberMe: z.boolean(),
      }),
    [tVal]
  );

  const {
    register,
    handleSubmit,
    getValues,
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
    setInfoMessage(null);

    try {
      await new Promise((resolve) => setTimeout(resolve, 800));

      if (data.email === "invalid@example.com") {
        setFormError(tAuth("generalError"));
        return;
      }

      setIsSuccess(true);
      if (onSuccess) {
        onSuccess(data);
      }
    } catch {
      setFormError(tAuth("unexpectedError"));
    }
  };

  const handleInputChange = () => {
    if (formError) setFormError(null);
    if (infoMessage) setInfoMessage(null);
  };

  const handleForgotPassword = (e: React.MouseEvent) => {
    e.preventDefault();
    const currentEmail = getValues("email");
    if (!currentEmail || !currentEmail.includes("@")) {
      setInfoMessage("Please enter your email address above to receive a password reset link.");
    } else {
      setInfoMessage(`Password reset link has been dispatched to ${currentEmail}. Please check your inbox.`);
    }
  };

  const handleStartTrial = (e: React.MouseEvent) => {
    e.preventDefault();
    setInfoMessage("Welcome! Creating your 14-day free studio account. Enter your venue email above and click 'Sign in' to proceed.");
  };

  return (
    <div className="card bg-surface-1 border border-hairline rounded-2xl shadow-none w-full">
      <div className="card-body p-6 sm:p-8">
        <div className="text-center mb-6">
          <Image
            src="/favicons.svg"
            alt="QRVenues logo"
            className="w-12 h-12 rounded-xl mx-auto mb-3"
            width={48}
            height={48}
          />
          <h1 className="text-xl sm:text-2xl font-medium tracking-tight text-ink">
            {tAuth("title")}
          </h1>
          <p className="text-xs text-ink-muted mt-1 leading-relaxed">
            {tAuth("subtitle")}
          </p>
        </div>

        {formError && (
          <div
            id="form-error-alert"
            role="alert"
            aria-live="polite"
            className="alert alert-error bg-red-500/10 border-semantic-error/20 text-semantic-error p-3 rounded-lg text-xs flex items-center gap-2 mb-4"
          >
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{formError}</span>
          </div>
        )}

        {infoMessage && (
          <div
            role="status"
            aria-live="polite"
            className="alert bg-surface-1 border-hairline text-ink p-3 rounded-lg text-xs flex items-center gap-2 mb-4"
          >
            <Sparkles className="w-4 h-4 text-fin-orange shrink-0" />
            <span>{infoMessage}</span>
          </div>
        )}

        {isSuccess && (
          <div
            id="form-success-alert"
            role="status"
            aria-live="polite"
            className="alert alert-success bg-emerald-500/10 border-semantic-success/20 text-semantic-success p-3 rounded-lg text-xs flex items-center gap-2 mb-4"
          >
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{tAuth("successRedirect")}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          {/* Email Field */}
          <fieldset className="fieldset w-full">
            <legend className="fieldset-legend text-xs font-medium text-ink mb-1.5">
              {tAuth("emailLabel")}
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
                placeholder={tAuth("emailPlaceholder")}
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
                {tAuth("passwordLabel")}
              </legend>
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-xs text-ink-muted hover:text-ink hover:underline font-medium cursor-pointer"
              >
                {tAuth("forgotPassword")}
              </button>
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
                placeholder={tAuth("passwordPlaceholder")}
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
              {tAuth("rememberMe")}
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
                  <span>{tAuth("signingIn")}</span>
                </>
              ) : (
                <span className="flex items-center justify-center gap-1.5">
                  <span>{tAuth("signInBtn")}</span>
                  <ArrowRight className="w-4 h-4" />
                </span>
              )}
            </button>
          </div>
        </form>

        <div className="text-center pt-4 border-t border-hairline-soft mt-5">
          <p className="text-xs text-ink-muted">
            {tAuth("noAccount")}{" "}
            <button
              type="button"
              onClick={handleStartTrial}
              className="text-ink font-medium hover:underline cursor-pointer"
            >
              {tAuth("trialLink")}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
