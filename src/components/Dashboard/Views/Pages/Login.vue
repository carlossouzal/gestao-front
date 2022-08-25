<template>
  <div class="login-page">
    <div class="wrapper wrapper-full-page">
      <div class="full-page login-page section-image">
        <!--   you can change the color of the filter page using: data-color="blue | azure | green | orange | red | purple" -->
        <div class="content">
          <div class="container">
            <div class="col-lg-4 col-md-6 ml-auto mr-auto">
              <form @submit.prevent="login">
                  <ul v-if="form.errors.length > 0" class="error" >
                    <li v-for="(error, index) in form.errors" :key="index">
                      {{error}}
                    </li>
                  </ul>
                <card type="login">
                  <h3 slot="header" class="header text-center">Gestão de Entregas</h3>

                  <fg-input v-model="form.username" addon-left-icon="nc-icon nc-single-02"
                            placeholder="Usuário"></fg-input>

                  <fg-input v-model="form.password" addon-left-icon="nc-icon nc-key-25" placeholder="Senha"
                            type="password"></fg-input>

                  <br>

                  <p-button @click="login" native-type="submit" slot="footer" type="warning" round block class="mb-3">Entrar</p-button>
                </card>
              </form>
            </div>
          </div>
        </div>
        <div class="full-page-background" style="background-image: url(static/img/dropshipping.jpg) "></div>
      </div>
    </div>
  </div>
</template>
<script>
  import { Card, Checkbox, Button } from 'src/components/UIComponents';
  import AppNavbar from './Layout/AppNavbar';
  import AppFooter from './Layout/AppFooter';
  import { login, profile } from '../../../../services/auth/';

  export default {
    components: {
      Card,
      AppNavbar,
      AppFooter,
      [Checkbox.name]: Checkbox,
      [Button.name]: Button
    },
    methods: {
      validate(){
        const errors = [];
        if(!this.form.username || this.form.username.lenght < 3){
          errors.push("O usuário não pode ser vazio.");
        }

        if(!this.form.password || this.form.password.length < 3){
          errors.push("A senha não pode ser vazia.");
        }

        this.form.errors = errors;
        if(errors.length > 0){
          return false;
        }

        return true;
      },
      async login() {
        if(!this.validate()){
          return;
        }

        const credentials = {username: this.form.username, password: this.form.password};
        let result = {};
        try{
          result = await login(credentials);
        }catch(err){
          console.error(err);
          const errors = ["Erro desconhecido, por favor contactar o suporte"];
          this.form.errors = errors;
          return;
        }

        if(result.status === 201){
          await this.signIn(result.data);
        } else if(result.status === 401){
          const errors = ["Usuário ou senha incorretos."];
          this.form.errors = errors;
        } else {
          const errors = ["Erro desconhecido, por favor contactar o suporte"];
          this.form.errors = errors;
        }
      },
      async signIn(response){
        localStorage.setItem('access_token', response.access_token);
        try{
          const result = await profile();
          localStorage.setItem('profile', JSON.stringify(result.data));
          this.$router.push({path: "/admin/overview"})
        }catch(err){
          console.error(err);
          const errors = ["Erro desconhecido, por favor contactar o suporte"];
          this.form.errors = errors;
          localStorage.clear();
        }
      }
    },
    data() {
      return {
        form: {
          username: '',
          password: '',
          errors: [],
        }
      }
    }
  }
</script>
<style Scoped>
  .error{
    list-style: none;
    background-color: #F56C6C;
    padding: 10px;
    border-radius: 5px;
    color: #fff;
  }
</style>
