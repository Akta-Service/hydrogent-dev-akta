"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useFetcher, useNavigate } from "@remix-run/react"
import Input from "../field/Input"
import { CheckCircle2 } from "lucide-react"

interface ActionResponse {
  error: string | null
  success?: boolean
  newCustomer?: { id: string } | null
  resetRequested?: boolean
}

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
  onLoginSuccess?: () => void
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const navigate = useNavigate()
  const fetcher = useFetcher<ActionResponse>()
  const [formMode, setFormMode] = useState<"login" | "register" | "recover">("login")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [passwordConfirm, setPasswordConfirm] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [showSuccess, setShowSuccess] = useState(false)

  useEffect(() => {
    if (fetcher.data?.error) {
      setError(fetcher.data.error)
    } else if (fetcher.data?.success || fetcher.data?.newCustomer) {
      if (formMode === "login" || formMode === "register") {
        localStorage.setItem('userEmail', email)
      }
      setEmail("")
      setPassword("")
      setPasswordConfirm("")
      setError(null)
      setShowSuccess(true)
    } else if (fetcher.data?.resetRequested) {
      setError(null)
      setEmail("")
    }
  }, [fetcher.data, formMode, email])

  const handleInputChange =
    (setter: React.Dispatch<React.SetStateAction<string>>) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setter(e.target.value)
      if (error) {
        setError(null)
      }
    }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const actionPath =
      formMode === "login" ? "/account/login" : formMode === "register" ? "/account/register" : "/account/recover"
    const formData = new FormData()
    formData.append("email", email)
    if (formMode === "login" || formMode === "register") {
      formData.append("password", password)
    }
    if (formMode === "register") {
      formData.append("passwordConfirm", passwordConfirm)
    }

    fetcher.submit(formData, { method: "POST", action: actionPath })
  }

  const isSubmitting: boolean = fetcher.state !== "idle"

  const handleGoogleLogin = () => {
    window.location.href = "/account/auth/google"
  }

  const handleFacebookLogin = () => {
    window.location.href = "/account/auth/facebook"
  }

  if (!isOpen) return null

  if (showSuccess) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white p-4 rounded-[18px] shadow-lg relative w-full max-w-[375px] overflow-hidden">
          <div className="bg-white text-primary flex flex-col items-center justify-center rounded-t-[18px]">
            <CheckCircle2 className="h-16 w-16 text-green-400" />
            <h2 className="text-[22px] palyfairsb mt-4">Success !</h2>
          </div>
          <div className="text-center">
            <p className="text-[15px] outfit text-primary mb-3">
              {formMode === "register"
                ? "Account created successfully!"
                : "Logged in successfully!"}
            </p>
            <button
              onClick={() => {
                setShowSuccess(false)
                onClose()
                if (formMode === "register") navigate("/account")
                if (onLoginSuccess) {
                  onLoginSuccess()
                }
              }}
              className="w-full py-3 bg-[#0c0d0d] hover:bg-[#2a2e2b] text-base text-white outfit uppercase rounded-[8px] transition-colors duration-200"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-[18px] shadow-lg p-[32px] relative w-full max-w-[375px]">
        <button className="cursor-pointer absolute top-4 right-4 text-gray-500 hover:text-gray-700" onClick={onClose}>
          ✖
        </button>
        <h2 className="text-[18px] playfairsb font-semibold mb-4">
          {formMode === "login" ? "Log In" : formMode === "register" ? "Register" : "Forgot Password"}
        </h2>
        <div className="bg-transparent">
          {formMode === "recover" && fetcher.data?.resetRequested ? (
            <div>
              <p className="text-[13px] outfit font-light text-[#454545]">
                If that email address is in our system, you will receive an email with instructions to reset your
                password in a few minutes.
              </p>
              <button
                type="button"
                onClick={() => {
                  setFormMode("login")
                  setEmail("")
                  setError(null)
                }}
                className="cursor-pointer mt-4 w-full px-4 py-[12px] bg-black text-[15px] outfit font-semibold text-white rounded-[8px] uppercase"
              >
                Return to Login
              </button>
            </div>
          ) : (
            <>
              <form onSubmit={handleSubmit}>
                <Input type="email" id="email" value={email} label="Email" onChange={handleInputChange(setEmail)} />
                {formMode !== "recover" && (
                  <Input
                    type="password"
                    id="password"
                    value={password}
                    label="Password"
                    onChange={handleInputChange(setPassword)}
                  />
                )}
                {formMode === "register" && (
                  <Input
                    type="password"
                    id="passwordConfirm"
                    value={passwordConfirm}
                    label="Re-enter Password"
                    onChange={handleInputChange(setPasswordConfirm)}
                  />
                )}
                {formMode === "login" && (
                  <div className="text-right relative top-[-7px]">
                    <button
                      type="button"
                      onClick={() => setFormMode("recover")}
                      className="cursor-pointer outfit font-light text-[rgba(69,69,69,1)] text-[12px]"
                    >
                      Forgot Password?
                    </button>
                  </div>
                )}
                {error && (
                  <div className="text-red-500 text-[12px] outfit mb-2">
                    {error === "Unidentified customer" ? "Wrong Email Or Password" : error}
                  </div>
                )}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="cursor-pointer uppercase mt-2 w-full px-4 py-[12px] bg-black text-[15px] outfit font-semibold text-white rounded-[8px] flex items-center justify-center"
                >
                  {isSubmitting ? (
                    <svg
                      className="animate-spin h-5 w-5 mr-2 text-primary"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  ) : null}
                  {formMode === "login" ? "Log In" : formMode === "register" ? "Register" : "Request Reset Link"}
                </button>
              </form>
              {formMode !== "recover" && (
                <>
                  <div className="my-[25px] relative">
                    <p className="text-[13px] outfit font-light text-[#5D5D5D] text-center">Or</p>
                    <span className="h-[1px] w-[132px] bg-[#D1D1D1] absolute left-0 top-[9px]"></span>
                    <span className="h-[1px] w-[132px] bg-[#D1D1D1] absolute right-0 top-[9px]"></span>
                  </div>
                  <div className="w-full mt-6">
                    <p className="text-center text-[13px] outfit font-light text-[#454545]">
                      {formMode === "login" ? (
                        <>
                          {`Don't have an account?`}{" "}
                          <button
                            type="button"
                            onClick={() => setFormMode("register")}
                            className="underline cursor-pointer"
                          >
                            Sign Up
                          </button>
                        </>
                      ) : (
                        <p className="text-center mt-4 text-[13px] outfit font-light text-[#454545]">
                          Already have an account?{" "}
                          <button
                            type="button"
                            onClick={() => setFormMode("login")}
                            className="underline cursor-pointer"
                          >
                            Log In
                          </button>
                        </p>
                      )}
                    </p>
                  </div>
                </>
              )}
              {formMode === "recover" && (
                <div className="w-full mt-4">
                  <p className="text-center mt-4 text-[13px] outfit font-light text-[#454545]">
                    Return to{" "}
                    <button type="button" onClick={() => setFormMode("login")} className="underline cursor-pointer">
                      Log In
                    </button>
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default LoginModal