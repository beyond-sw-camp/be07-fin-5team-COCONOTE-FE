<template>
    <div class="thread">
        <div>
            <div class="image">
                {{ id }}
            </div>
        </div>
        <div class="thread-content">
            <div class="title">
                <div class="nickName">{{nickName}}</div>
                <div class="createdTime">{{createdTime}}</div>
                <div class="tag">tag</div>
            </div>
            <div class="content">{{content}}</div>
            <div class="files">{{files}}</div>
            <div class="comment">comment</div>
        </div>
    </div>
</template>
  
<script>
    export default {
    props: ['image', 'nickName', 'createdTime','content','files','id'],
    data() {
        return {};
    },
    computed: {},
    created() {},
    methods: {},
    };
</script>
<style scoped>
.thread {
    display: flex;
}
.image {
    margin: 10px;
}
.thread-content {
    gap: 10px;
}
.title {
    display: flex;
    gap: 10px;
}
.nickName {

}
.createdTime {
    
}
.tag {
    
}
.content {
    
}
.files {
    
}
.comment {
    
}
</style>


  