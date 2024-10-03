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
            
            <div class="image-group">
                <div v-for="(file, index) in this.files" :key="index">
                    <img :src="file.fileURL" alt="image" @error="e => e.target.src = require('@/assets/file.png')"  style="height: 120px; width: 120px; object-fit: cover;">
                    <p class="custom-contents">{{file.fileName}}</p>
                </div>
            </div>
            
            <div class="comment">comment</div>
        </div>
    </div>
</template>
  
<script>
    export default {
    props: ['id','type', 'image', 'nickName', 'createdTime','content','files','childThreads','tags'],
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
.image-group {
  display: flex;
  flex-direction: row;
  width: 120px;
  max-height: 180px;
}
.custom-contents{
  max-width: 120px; /* 제목의 최대 너비를 설정 */
  overflow: hidden; /* 내용이 넘칠 경우 숨김 처리 */
  text-overflow: ellipsis !important; /* 넘치는 텍스트에 '...' 추가 (이거 적용안됨 이후 수정필요)*/
  white-space: nowrap; /* 텍스트 줄 바꿈 방지 */
}
.comment {
    
}
</style>


  