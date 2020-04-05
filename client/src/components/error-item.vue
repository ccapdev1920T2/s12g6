<template>
    <div id="error" class="flex content-center">
        <div class="error w-full">
            <h1 id="oops">Oops!</h1>
            <p><b>Error {{ error }}</b></p>
            <p>{{ message }}</p><br>
            <router-link
                class="btn btn-rounded btn-gradient shadow-md grow py-1 px-2"
                to="/">
                Go Back
            </router-link>
        </div>
    </div>
</template>

<style scoped>
#error {
    height: 100vh;
}

.error {
    font-family: 'IBM Plex Sans', sans-serif;
    text-align: center;
    background-color: white;
}

#oops {
    font-size: 104px;
    color: #E83A63;
    font-style: italic;
}

p {
    font-size: 24px;
    color: #666666
}
</style>

<script>
export default {
    props: {
        error: Number,
        message: String
    },
}
</script>