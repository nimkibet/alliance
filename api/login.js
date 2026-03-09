// =====================================================
// LOGIN API - Email-based Admin Credentials
// =====================================================

export default function handler(req, res) {
  const { username, password } = req.body;

  // Hardcoded admin credentials with department mapping
  // Format: username = "admin@department"
  const ADMIN_CREDENTIALS = {
    "admin@spas": "Admin2026!",
    "admin@med": "Admin2026!",
    "admin@edu": "Admin2026!",
    "admin@bus": "Admin2026!",
    "admin@eng": "Admin2026!"
  };

  // Department mapping based on email domain
  const getDepartment = (email) => {
    const domain = email.split('@')[1]?.toLowerCase();
    const deptMap = {
      'spas': 'SPAS',
      'med': 'HEALTH',
      'medical': 'HEALTH',
      'health': 'HEALTH',
      'edu': 'EDU',
      'education': 'EDU',
      'bus': 'BUS',
      'business': 'BUS',
      'eng': 'ENG',
      'engineering': 'ENG'
    };
    return deptMap[domain] || 'SPAS';
  };

  if (req.method === 'POST') {
    // Check if username contains @
    if (!username || !username.includes('@')) {
      return res.status(401).json({ 
        success: false, 
        message: "Invalid format. Use admin@dept (e.g., admin@spas)" 
      });
    }

    // Check if credentials are valid
    const validPassword = ADMIN_CREDENTIALS[username.toLowerCase()];
    
    if (validPassword && password === validPassword) {
      const department = getDepartment(username);
      return res.status(200).json({ 
        success: true, 
        token: "secret-session-key",
        department: department,
        email: username
      });
    } else {
      return res.status(401).json({ 
        success: false, 
        message: "Invalid credentials" 
      });
    }
  }
  res.status(405).json({ message: "Method not allowed" });
}
