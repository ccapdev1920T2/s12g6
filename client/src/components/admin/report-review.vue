<template>
    <div class="absolute w-3/5 z-40 bg-white px-8 py-4 shadow rounded mt-32">
        <h1 class="text-pink-500 text-3xl">Report {{ report._id }}</h1>
        Reported User: {{ report.reported }} <br>
        Reporter User: {{ report.user }} <br>
        Type: {{ report.reportType }} <br>
        Date: {{ date }} <br><br>
        <h1 class="text-xl"><b>{{ report.title }}</b></h1><br>
        &emsp;{{ report.description }} <br><br>
        <button class="bg-red-600 px-4 py-2 mr-2 rounded text-xl text-white" @click="$emit('warnUser')">Warn User</button>
        <button class="bg-red-600 px-4 py-2 mr-2 rounded text-xl text-white" @click="$emit('deleteUser')">Remove User</button>
        <button class="bg-white px-4 py-2 mr-2 rounded text-xl border-2" @click="$emit('dismissReport')">Dismiss Report</button>
    </div>
</template>

<script>
export default {
    props: {
        report: {
            type: Object
        },
        date: String,
    },
}
</script>