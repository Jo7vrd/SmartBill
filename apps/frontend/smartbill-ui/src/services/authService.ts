const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1'

export const authService = {
    login: async (email: string, password: string) => {
        const res = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        })
        const data = await res.json()
        if (res.ok) {
            localStorage.setItem('token', data.token)
            localStorage.setItem('user', JSON.stringify(data.user))
            return true
        }
        throw new Error(data.error || 'Gagal login')
    },

    register: async (name: string, email: string, password: string) => {
        const res = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
        })
        const data = await res.json()
        if (res.ok) {
            localStorage.setItem('token', data.token)
            localStorage.setItem('user', JSON.stringify(data.user))
            return true
        }
        throw new Error(data.error || 'Gagal mendaftar')
    },

    logout: () => {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        window.location.reload()
    },

    getToken: () => localStorage.getItem('token'),
    getUser: () => JSON.parse(localStorage.getItem('user') || 'null')
}