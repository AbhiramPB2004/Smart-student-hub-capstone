def password_setup_email(name, token):
    return f"""
        <h2>Hello {name}, 🎓</h2>
        <p>Your Smart Student Hub account has been created.</p>
        <p>Please click the link below to set your password:</p>

        <a href="http://localhost:3000/setup-password?token={token}">
            Set Password
        </a>

        <p>This link expires in 24 hours.</p>
    """
