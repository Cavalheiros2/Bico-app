import { useState, createContext,useContext } from "react";

export interface Usuario{
    id:number;
    nome: string;
    apelido: string;
    email: string;
    cpf: string;
    telefone: string;
}

interface AuthContextData{
    usuario:Usuario | null;
    setUsuario:(usuario:Usuario|null)=>void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);

  return (
    <AuthContext.Provider value={{ usuario, setUsuario }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}