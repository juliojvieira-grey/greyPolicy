export function generateSecurePassword(length = 14): string {
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    const lowercase = 'abcdefghijklmnopqrstuvwxyz'
    const numbers = '0123456789'
    const symbols = '!@#$%^&*()-_=+[]{};:,.<>?'
  
    const all = uppercase + lowercase + numbers + symbols
    let password = ''
  
    // Garante pelo menos um de cada tipo
    password += uppercase[Math.floor(Math.random() * uppercase.length)]
    password += lowercase[Math.floor(Math.random() * lowercase.length)]
    password += numbers[Math.floor(Math.random() * numbers.length)]
    password += symbols[Math.floor(Math.random() * symbols.length)]
  
    for (let i = 4; i < length; i++) {
      password += all[Math.floor(Math.random() * all.length)]
    }
  
    // Embaralha a senha
    return password
      .split('')
      .sort(() => 0.5 - Math.random())
      .join('')
  }
  