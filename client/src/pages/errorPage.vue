<template>
    <div>
        <error-item :error="error" :message="message"/>
    </div>
</template>

<script>
import ErrorItem from '@/components/error-item.vue'

export default {
    components: {
        ErrorItem
    },

    props: {
        error: Number,
        message: String
    },
}
</script>