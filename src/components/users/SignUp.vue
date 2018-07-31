<template>
    <v-card grow>
        <v-toolbar color="primary" class="white--text" flat>
            <v-toolbar-title>Sign Up</v-toolbar-title>
        </v-toolbar>
        <v-form @submit.prevent="signup" v-model="validSignUp" ref="formSignUp">
            <v-card-text>
                <v-text-field box v-model="user.details.firstName" label="First Name" :rules="fNameRules" hint="Insert your first name" required>
                </v-text-field>
                <v-text-field box v-model="user.details.lastName" label="Last Name" :rules="lNameRules" hint="Insert your last name" required>
                </v-text-field>
                <v-text-field box type="number" v-model="user.details.age" label="Age" :rules="ageRules" hint="Insert your age" required>
                </v-text-field>
                <v-text-field box mask="phone" v-model="user.mobile" label="Mobile Phone" :rules="phoneRules" hint="Insert your mobile phone number" required>
                </v-text-field>
								<v-text-field box v-model="user.email" label="E-mail" :rules="emailRules" hint="Insert a valid E-mail" required>
								</v-text-field>
								<v-select :items="['Male', 'Female']" box v-model="user.details.gender" label="Gender" :rules="genderRules" hint="Pick your gender" required></v-select>
                <v-text-field box v-model="user.password" label="Password" :rules="passwordRules" :type="show ? 'text' : 'password'" :append-icon="show ? 'visibility_off' : 'visibility'"
                    @click:append="show = !show" hint="At least 8 characters" required>
                </v-text-field>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" type="submit" :disabled="!validSignUp" ripple>sign up</v-btn>
            </v-card-actions>
        </v-form>
    </v-card>
</template>

<script>
import { EventBus, SNACK_MSG } from "@/services/EventBusService";
import { USER_SIGNUP } from "@/modules/UserModule";

export default {
  name: "signUp",
  data() {
    return {
      validSignUp: true,
      user: {
        email: "",
        password: "",
        details: {
          firstName: "",
          lastName: "",
          age: "",
          gender: ""
        },
        balance: 100,
        mobile: ""
      },
      fNameRules: [v => !!v || "First name is required"],
      lNameRules: [v => !!v || "Last name is required"],
      ageRules: [v => !!v || "Age is required"],
      genderRules: [v => !!v || "Gender is required"],
      phoneRules: [v => !!v || "Gender is required"],
      emailRules: [
        v => !!v || "E-mail is required",
        v => /.+@.+/.test(v) || "Please enter a valid email"
      ],
      show: false,
      passwordRules: [
        v => !!v || "Password is required",
        v => v.length >= 8 || "Minimum 8 characters"
      ]
    };
  },
  methods: {
    signup() {
      if (this.$refs.formSignUp.validate()) {
        this.$store
          .dispatch({ type: USER_SIGNUP, user: this.user })
          .then(user => {
            EventBus.$emit(SNACK_MSG, {
              text: `Sign up succeseed. Now you can login`,
              bgColor: "success"
            });
            this.$router.push("/");
          })
          .catch(err => {
            EventBus.$emit(SNACK_MSG, {
              text: `Sign up failed. Try again`,
              bgColor: "error"
            });
            console.log(err);
          });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
</style>