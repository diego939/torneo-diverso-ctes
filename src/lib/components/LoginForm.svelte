<script lang="ts">
  import { createEventDispatcher } from "svelte";

  export let isAuthenticated = false;
  export let currentUser = null;

  const dispatch = createEventDispatcher();

  let email = "";
  let password = "";
  let loading = false;
  let error = "";

  async function handleLogin() {
    if (!email || !password) {
      error = "Por favor completa todos los campos";
      return;
    }

    loading = true;
    error = "";

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const user = await response.json();
        localStorage.setItem("admin_user", JSON.stringify(user));
        currentUser = user;
        isAuthenticated = true;
        dispatch("login", user);
      } else {
        const errorData = await response.json();
        error = errorData.message || "Credenciales incorrectas";
      }
    } catch (err) {
      error = "Error de conexión. Intenta nuevamente.";
    } finally {
      loading = false;
    }
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === "Enter") {
      handleLogin();
    }
  }
</script>

<div class="login-form">
  <div class="form-group">
    <label for="email">Email:</label>
    <input
      id="email"
      type="email"
      bind:value={email}
      on:keydown={handleKeydown}
      placeholder="admin@corrientesdiversa.org"
      disabled={loading}
    />
  </div>

  <div class="form-group">
    <label for="password">Contraseña:</label>
    <input
      id="password"
      type="password"
      bind:value={password}
      on:keydown={handleKeydown}
      placeholder="Tu contraseña"
      disabled={loading}
    />
  </div>

  {#if error}
    <div class="error-message">
      ❌ {error}
    </div>
  {/if}

  <button on:click={handleLogin} disabled={loading} class="login-button">
    {loading ? "Iniciando sesión..." : "🔐 Iniciar Sesión"}
  </button>
</div>

<style>
  .login-form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .form-group label {
    font-weight: 600;
    color: #333;
  }

  .form-group input {
    padding: 0.75rem;
    border: 2px solid #ddd;
    border-radius: 8px;
    font-size: 1rem;
    transition: border-color 0.3s ease;
  }

  .form-group input:focus {
    outline: none;
    border-color: #667eea;
  }

  .form-group input:disabled {
    background-color: #f5f5f5;
    cursor: not-allowed;
  }

  .error-message {
    background: #fee;
    color: #c33;
    padding: 0.75rem;
    border-radius: 8px;
    border: 1px solid #fcc;
    font-size: 0.9rem;
  }

  .login-button {
    background: linear-gradient(135deg, #667eea, #764ba2);
    color: white;
    border: none;
    padding: 1rem;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition:
      transform 0.3s ease,
      box-shadow 0.3s ease;
  }

  .login-button:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(102, 126, 234, 0.3);
  }

  .login-button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .login-info {
    background: #f8f9ff;
    padding: 1rem;
    border-radius: 8px;
    border: 1px solid #e8ecff;
    margin-top: 1rem;
  }

  .login-info p {
    margin: 0.25rem 0;
    font-size: 0.9rem;
    color: #666;
  }

  .login-info p:first-child {
    font-weight: 600;
    color: #333;
  }
</style>
