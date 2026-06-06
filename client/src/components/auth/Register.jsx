import { useState, useEffect } from 'react'
import { z } from 'zod'
import axios from 'axios'
import '../../App.css'

const registerSchema = z.object({
	firstName: z.string().min(3, 'First name must be at least 3 characters long'),
	lastName: z.string().min(1, 'Last name is required'),
	username: z.string().min(3, 'Username must be at least 3 characters'),
	email: z.string().email('Please enter a valid email address'),
	phone: z.string().min(7, 'Phone number is required'),
	role: z.enum(['Vendor', 'Procurement Officer', 'Manager', 'Admin'], {
		required_error: 'Please select a role',
	}),
	country: z.string().min(2, 'Country is required'),
	password: z
		.string()
		.min(8, 'Password must be at least 8 characters long')
		.regex(/[A-Z]/, 'Password must include one uppercase letter')
		.regex(/[0-9]/, 'Password must include one number'),
})

const initialForm = {
	firstName: '',
	lastName: '',
	username: '',
	email: '',
	phone: '',
	role: '',
	country: '',
	password: '',
}

const Toast = ({ message, type, onClose }) => {
	useEffect(() => {
		if (message) {
			const timer = setTimeout(() => onClose(), 4000)
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

function Register() {
	const [form, setForm] = useState(initialForm)
	const [errors, setErrors] = useState({})
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [showPassword, setShowPassword] = useState(false)
	const [toast, setToast] = useState({ message: '', type: '' })
	
	const [reqs, setReqs] = useState({ length: false, upper: false, number: false })

	useEffect(() => {
		setReqs({
			length: form.password.length >= 8,
			upper: /[A-Z]/.test(form.password),
			number: /[0-9]/.test(form.password)
		})
	}, [form.password])

	const showToast = (message, type) => setToast({ message, type })

	const handleChange = (event) => {
		const { name, value } = event.target
		setForm((currentForm) => ({ ...currentForm, [name]: value }))
		if (errors[name]) setErrors((currentErrors) => ({ ...currentErrors, [name]: '' }))
	}

	const handleSubmit = async (event) => {
		event.preventDefault()

		const result = registerSchema.safeParse(form)

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
			const response = await axios.post('http://127.0.0.1:5000/api/auth/register', form)
			showToast(response.data.message, 'success')
			setForm(initialForm)
			setShowPassword(false)
			setTimeout(() => { window.location.hash = '#login' }, 3500)
		} catch (error) {
			const errorMsg = error.response?.data?.error || 'Registration failed'
			showToast(errorMsg, 'error')
		} finally {
			setIsSubmitting(false)
		}
	}

	const getReqStyle = (isValid) => ({
		color: isValid ? '#10b981' : '', 
		fontWeight: isValid ? '700' : ''
	})

	const reqCount = (reqs.length ? 1 : 0) + (reqs.upper ? 1 : 0) + (reqs.number ? 1 : 0)
	const progressPercentage = (reqCount / 3) * 100
	const isPasswordValid = reqCount === 3

	return (
		<main className="login-shell">
			<Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: '' })} />

			<section className="login-card register-card">
				<div className="login-hero">
					<div className="login-logo">
						<img src="/Logo.PNG" alt="VendorBridge Logo" />
					</div>
					<h1>Register</h1>
					<span>Create your account in a few simple steps.</span>
				</div>

				<form className="login-form register-form" onSubmit={handleSubmit} noValidate>
					<div className="register-row">
						<label className="field">
							<p align="left">First name</p>
							<input
								type="text"
								name="firstName"
								value={form.firstName}
								onChange={handleChange}
								placeholder="Enter your first name"
								autoComplete="given-name"
								style={errors.firstName ? { borderColor: '#dc2626' } : {}}
							/>
							{errors.firstName ? <small>{errors.firstName}</small> : null}
						</label>

						<label className="field">
							<p align="left">Last name</p>
							<input
								type="text"
								name="lastName"
								value={form.lastName}
								onChange={handleChange}
								placeholder="Enter your last name"
								autoComplete="family-name"
								style={errors.lastName ? { borderColor: '#dc2626' } : {}}
							/>
							{errors.lastName ? <small>{errors.lastName}</small> : null}
						</label>
					</div>

					<div className="register-row">
						<label className="field">
							<p align="left">Email address</p>
							<input
								type="email"
								name="email"
								value={form.email}
								onChange={handleChange}
								placeholder="Enter your email address"
								autoComplete="email"
								style={errors.email ? { borderColor: '#dc2626' } : {}}
							/>
							{errors.email ? <small>{errors.email}</small> : null}
						</label>

						<label className="field">
							<p align="left">Phone number</p>
							<input
								type="tel"
								name="phone"
								value={form.phone}
								onChange={handleChange}
								placeholder="Enter your phone number"
								autoComplete="tel"
								style={errors.phone ? { borderColor: '#dc2626' } : {}}
							/>
							{errors.phone ? <small>{errors.phone}</small> : null}
						</label>
					</div>

					<div className="register-row">
						<label className="field">
							<p align="left">Role</p>
							<select
								name="role"
								value={form.role}
								onChange={handleChange}
								style={errors.role ? { borderColor: '#dc2626' } : {}}
							>
								<option value="">Select a role</option>
								<option value="Procurement Officer">Procurement Officer</option>
								<option value="Manager">Manager</option>
								<option value="Admin">Admin</option>
							</select>
							{errors.role ? <small>{errors.role}</small> : null}
						</label>

						<label className="field">
							<p align="left">Country</p>
							<input
								type="text"
								name="country"
								value={form.country}
								onChange={handleChange}
								placeholder="Enter your country"
								autoComplete="country-name"
								style={errors.country ? { borderColor: '#dc2626' } : {}}
							/>
							{errors.country ? <small>{errors.country}</small> : null}
						</label>
					</div>

					<label className="field">
						<p align="left">Username</p>
						<input
							type="text"
							name="username"
							value={form.username}
							onChange={handleChange}
							placeholder="Create a unique username"
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
								autoComplete="new-password"
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
						
						<div style={{ height: '6px', background: 'rgba(148, 163, 184, 0.2)', borderRadius: '999px', marginTop: '6px', overflow: 'hidden' }}>
							<div style={{
								height: '100%',
								width: `${progressPercentage}%`,
								background: 'linear-gradient(90deg, #ef4444 0%, #eab308 50%, #10b981 100%)',
								transition: 'width 0.4s cubic-bezier(0.22, 1, 0.36, 1)'
							}}></div>
						</div>
					</label>

					<div className="password-guidelines">
						<ul>
							<li style={getReqStyle(reqs.length)}>8+ Characters</li>
							<li style={getReqStyle(reqs.upper)}>Uppercase</li>
							<li style={getReqStyle(reqs.number)}>One Number</li>
						</ul>
					</div>

					<button 
						className="login-button" 
						type="submit" 
						disabled={isSubmitting || !isPasswordValid}
						style={{ opacity: (!isPasswordValid && !isSubmitting) ? 0.6 : 1, cursor: !isPasswordValid ? 'not-allowed' : 'pointer' }}
					>
						{isSubmitting ? 'Creating account...' : 'Create Account'}
					</button>

					<p className="signup-text">
						Already have an account? <a href="#login">Log in</a>
					</p>
				</form>
			</section>
		</main>
	)
}

export default Register