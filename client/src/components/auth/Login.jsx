import { useState, useEffect } from 'react'
import { z } from 'zod'
import axios from 'axios'
import '../../App.css'

const loginSchema = z.object({
	username: z.string().min(1, 'Username is required'),
	password: z.string().min(1, 'Password is required'),
})

const initialForm = {
	username: '',
	password: '',
}

// Simple Toast component that doesn't rely on external CSS
const Toast = ({ message, type, onClose }) => {
	useEffect(() => {
		if (message) {
			const timer = setTimeout(() => onClose(), 3000)
			return () => clearTimeout(timer)
		}
	}, [message, onClose])

	if (!message) return null

	return (
		<div style={{
			position: 'fixed', top: '24px', left: '50%', transform: 'translateX(-50%)',
			backgroundColor: type === 'success' ? '#10b981' : '#ef4444', color: 'white',
			padding: '12px 24px', borderRadius: '12px', zIndex: 1000, fontWeight: '600',
			boxShadow: '0 10px 25px rgba(0,0,0,0.1)', transition: 'all 0.3s ease'
		}}>
			{message}
		</div>
	)
}

function Login() {
	const [form, setForm] = useState(initialForm)
	const [errors, setErrors] = useState({})
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [showPassword, setShowPassword] = useState(false)
	const [toast, setToast] = useState({ message: '', type: '' })

	const showToast = (message, type) => setToast({ message, type })

	const handleChange = (event) => {
		const { name, value } = event.target
		setForm((currentForm) => ({ ...currentForm, [name]: value }))
		if (errors[name]) setErrors((currentErrors) => ({ ...currentErrors, [name]: '' }))
	}

	const handleSubmit = async (event) => {
		event.preventDefault()

		const result = loginSchema.safeParse(form)

		if (!result.success) {
			const nextErrors = {}
			for (const issue of result.error.issues) {
				const fieldName = issue.path[0]
				if (typeof fieldName === 'string' && !nextErrors[fieldName]) {
					nextErrors[fieldName] = issue.message
				}
			}
			setErrors(nextErrors)
			return
		}

		setErrors({})
		setIsSubmitting(true)

		try {
			const response = await axios.post('http://127.0.0.1:5000/api/auth/login', form)
			showToast(response.data.message, 'success')
			setForm(initialForm)
			setShowPassword(false)
			
			// Store the JWT and redirect
			localStorage.setItem('token', response.data.token)
			setTimeout(() => { window.location.hash = '#home' }, 1000)

		} catch (error) {
			const errorMsg = error.response?.data?.error || 'An error occurred during login'
			showToast(errorMsg, 'error')
		} finally {
			setIsSubmitting(false)
		}
	}

	return (
		<main className="login-shell">
			<Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: '' })} />
			
			<section className="login-card">
				<div className="login-hero">
					<h1>Login</h1>
					<span>Please enter your credentials to access your account.</span>
				</div>

				<form className="login-form" onSubmit={handleSubmit} noValidate>
					<label className="field">
						<p align="left">Username</p>
						<input
							type="text"
							name="username"
							value={form.username}
							onChange={handleChange}
							placeholder="Enter your username"
							autoComplete="username"
							style={errors.username ? { borderColor: '#dc2626' } : {}}
						/>
						{errors.username ? <small>{errors.username}</small> : null}
					</label>

					<label className="field">
						<p align="left">Password</p>
						<div className="password-field">
							<input
								type={showPassword ? 'text' : 'password'}
								name="password"
								value={form.password}
								onChange={handleChange}
								placeholder="••••••••"
								autoComplete="current-password"
								style={errors.password ? { borderColor: '#dc2626' } : {}}
							/>
							<button
								type="button"
								className="password-toggle"
								onClick={() => setShowPassword((currentValue) => !currentValue)}
								aria-label={showPassword ? 'Hide password' : 'Show password'}
								aria-pressed={showPassword}
							>
								{showPassword ? (
									<svg viewBox="0 0 24 24" aria-hidden="true">
										<path d="M12 5c5.55 0 10.11 3.58 11.74 7-1.63 3.42-6.19 7-11.74 7S1.89 15.42.26 12C1.89 8.58 6.45 5 12 5Zm0 2C7.94 7 4.23 9.42 2.69 12 4.23 14.58 7.94 17 12 17s7.77-2.42 9.31-5C19.77 9.42 16.06 7 12 7Zm0 2a3 3 0 1 1 0 6 3 3 0 0 1 0-6Z" />
									</svg>
								) : (
									<svg viewBox="0 0 24 24" aria-hidden="true">
										<path d="M2.1 3.51 3.51 2.1 21.9 20.49l-1.41 1.41-3.03-3.03A11.35 11.35 0 0 1 12 20C6.45 20 1.89 16.42.26 13c.73-1.53 1.92-3.05 3.46-4.34L2.1 3.51Zm5.05 5.05A8.93 8.93 0 0 0 2.69 12C4.23 14.58 7.94 17 12 17c1.09 0 2.15-.15 3.13-.44l-2.1-2.1a3 3 0 0 1-4.59-4.59L7.15 8.56Zm4.01 4.01 1.66 1.66a1 1 0 0 0-1.66-1.66Zm2.28-2.29 2.36 2.36A3 3 0 0 0 12 9c-.53 0-1.03.14-1.47.4l1.1 1.1c.1-.3.23-.45.81-.45.62 0 1.14.53 1.14 1.14 0 .58-.15.71-.24.79Z" />
									</svg>
								)}
							</button>
						</div>
						{errors.password ? <small>{errors.password}</small> : null}
					</label>

					<button className="login-button" type="submit" disabled={isSubmitting}>
						{isSubmitting ? 'Signing in...' : 'Login'}
					</button>

					<p className="signup-text">
						Don&apos;t have an account? <a href="#signup">Signup</a>
					</p>
				</form>
			</section>
		</main>
	)
}

export default Login