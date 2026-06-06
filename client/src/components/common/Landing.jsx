import '../../App.css'

function Landing() {
	return (
		<main className="landing-shell">
			<section className="landing-panel">
				<p className="landing-badge">Odoo Hackathon 2026</p>
				<div className="landing-copy">
					<h1>Build, pitch, and ship your Odoo hackathon idea.</h1>
					<p>
						This is a clean starter template for your event landing page. Use it to introduce the
						challenge, guide participants, and send them straight to login or registration.
					</p>
				</div>

				<div className="landing-highlights">
					<div>
						<strong>24 Hours</strong>
						<span>Rapid prototype sprint</span>
					</div>
					<div>
						<strong>Teams</strong>
						<span>Collaborate and submit together</span>
					</div>
					<div>
						<strong>Demo Ready</strong>
						<span>Polished idea, practical impact</span>
					</div>
				</div>

				<div className="landing-actions">
					<a className="landing-button landing-button-primary" href="#login">
						Login
					</a>
					<a className="landing-button landing-button-secondary" href="#signup">
						Signup / Register
					</a>
				</div>
			</section>
		</main>
	)
}

export default Landing
