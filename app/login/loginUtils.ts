//loginUtils.ts
type User = {
  name: string;
  email: string;
  password: string;
};

export function login(email: string, password: string): boolean {
  const users = JSON.parse(localStorage.getItem('users') || '[]') as User[];
  const user = users.find(u => u.email === email && u.password === password);
  if (user) {
    localStorage.setItem('currentUser', JSON.stringify(user));
    return true;
  }
  alert('Invalid email or password');
  return false;
} 


