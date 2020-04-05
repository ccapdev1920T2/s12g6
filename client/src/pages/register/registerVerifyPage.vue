<template>
    <div>
        <loading v-if="loading" :bg="false"/>
        <error-item v-if="error" :error="errnum" :message="errmsg"/>
    </div>
</template>

<script>
import UserServices from '@/services/UserService'

import Loading from '@/components/loading.vue'
import ErrorItem from '@/components/error-item.vue'

export default {
    components: {
        Loading,
        ErrorItem,
    },

    data() {
        return {
            loading: true,
            error: false,
            errnum: 0,
            errmsg: '',
        }
    },

    created() {
        UserServices.getVerifySecret(this.$route.query.key)
            .then(res => {
                this.$router.push({
                    path: '/register/info',
                    query: {
                        key: res.data.id
                    }
                });
            })
            .catch(err => {
                this.loading = false
                this.error = true
                this.errnum = err.status
                this.errmsg = err.data
            });
    }
}
</script>