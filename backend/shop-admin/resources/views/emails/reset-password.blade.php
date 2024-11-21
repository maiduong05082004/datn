@component('mail::message')
# BeeStyle

Hello!

You are receiving this email because we received a password reset request for your account.

@component('mail::button', ['url' => $resetLink, 'color' => 'primary'])
Reset Password
@endcomponent

If you did not request a password reset, no further action is required.

Regards,  
**BeeStyle**

---

If you're having trouble clicking the "Reset Password" button, copy and paste the URL below into your web browser:  
[{{ $resetLink }}]({{ $resetLink }})

© {{ now()->year }} BeeStyle. All rights reserved.
@endcomponent
