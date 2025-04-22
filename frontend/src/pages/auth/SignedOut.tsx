export default function SignedOut() {
    return (
      <div style={{ textAlign: 'center', marginTop: '4rem' }}>
        <h1>Você saiu com sucesso</h1>
        <p>Até breve! Você foi desconectado do Microsoft Entra ID.</p>
        <a href="/login">Fazer login novamente</a>
      </div>
    )
  }
  