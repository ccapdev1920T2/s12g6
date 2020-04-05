<template>
    <div class="flex flex-col">
        <h2 class="text-2xl">Client</h2>
        <table class="w-screen">
            <tr>
                <th>Dependencies</th>
                <th>Version</th>
            </tr>
            <tr v-for="(version, dependency) in clientDependencies" :key="dependency">
                <td>{{ dependency }}</td>
                <td>{{ version }}</td>
            </tr>
            <tr>
                <th>DevDependencies</th>
                <th>Version</th>
            </tr>
            <tr v-for="(version, dependency) in clientDevDependencies" :key="dependency">
                <td>{{ dependency }}</td>
                <td>{{ version }}</td>
            </tr>
        </table>

        <h2 class="text-2xl">Server</h2>
        <table class="w-screen">
            <tr>
                <th>Dependencies</th>
                <th>Version</th>
            </tr>
            <tr v-for="(version, dependency) in serverDependencies" :key="dependency">
                <td>{{ dependency }}</td>
                <td>{{ version }}</td>
            </tr>
            <tr>
                <th>DevDependencies</th>
                <th>Version</th>
            </tr>
            <tr v-for="(version, dependency) in serverDevDependencies" :key="dependency">
                <td>{{ dependency }}</td>
                <td>{{ version }}</td>
            </tr>
        </table>

    </div>
</template>

<style>
table {
  font-family: arial, sans-serif;
  border-collapse: collapse;
  width: 75%;
  table-layout: fixed;
}

td, th {
  border: 1px solid #dddddd;
  text-align: left;
  padding: 8px;
}

tr:nth-child(odd) {
  background-color: white;
}

body{
    background-color: #f2f8ff;
}
</style>

<script>
export default {
    data() {
        return {
            clientDependencies: {
                "@fortawesome/fontawesome-svg-core": "^1.2.27",
                "@fortawesome/free-solid-svg-icons": "^5.12.1",
                "@fortawesome/vue-fontawesome": "^0.1.9",
                "@svgdotjs/svg.js": "^3.0.16",
                "axios": "^0.19.2",
                "core-js": "^3.6.4",
                "moment": "^2.24.0",
                "socket.io-client": "^2.3.0",
                "tailwindcss": "^1.2.0",
                "vue": "^2.6.11",
                "vue-mq": "^1.0.1",
                "vue-router": "^3.1.5",
                "vue-router-multiguard": "^1.0.3",
                "vuex": "^3.1.2"
            },
            clientDevDependencies: {
                "@vue/cli-plugin-babel": "^4.2.3",
                "@vue/cli-plugin-eslint": "^4.2.3",
                "@vue/cli-service": "^4.2.3",
                "babel-eslint": "^10.0.3",
                "eslint": "^6.7.2",
                "eslint-plugin-vue": "^6.1.2",
                "sass": "^1.19.0",
                "sass-loader": "^8.0.0",
                "vue-plugin-load-script": "^1.2.0",
                "vue-template-compiler": "^2.6.11"
            },
            serverDependencies: {
                "bcrypt": "^3.0.8",
                "body-parser": "^1.19.0",
                "cookie-parser": "^1.4.4",
                "cors": "^2.8.5",
                "crypto": "^1.0.1",
                "csurf": "^1.11.0",
                "dotenv": "^8.2.0",
                "express": "^4.16.4",
                "express-session": "^1.17.0",
                "express-validator": "^6.3.1",
                "fs-extra": "^9.0.0",
                "jsonwebtoken": "^8.5.1",
                "moment": "^2.24.0",
                "mongodb": "^3.5.3",
                "morgan": "~1.9.1",
                "multer": "^1.4.2",
                "nodemailer": "^6.4.2",
                "socket.io": "^2.3.0"
            },
            serverDevDependencies: {
                "nodemon": "^2.0.2"
            }
        }
    }
}
</script>