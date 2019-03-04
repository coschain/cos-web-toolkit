<template>
  <div class="container body py-2">
    <div class="file-uploader">
      <label for="f-uploader" class="py-2">Select Your Account File</label>
      <input type="file" class="form-uploader py-3" id="f-uploader" placeholder="Select An Account File" accept="application/json" @change="onFileChange">
    </div>
    <button class="btn btn-block">Unlock</button>
  </div>
</template>

<script>
export default {
  name: 'Info',
  data () {
    return {
      data: null
    }
  },
  methods: {
    onFileChange (e) {
      let files = e.target.files || e.dataTransfer.files
      if (files.length) {
        console.log('haha')
        const f = files[0]
        const reader = new FileReader()
        let vm = this
        reader.onload = (e) => {
          vm.data = e.target.result
        }
        reader.readAsText(f)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .btn {
    background-color: black;
    border-radius: 0;
    color: white;
    font-weight: 500;
    letter-spacing: 2px;
    margin: 1rem 0 .5rem 0;
    padding: 0.75rem 2.1875rem;
  }
  .btn-block {
    display: block;
    width: 100%;
  }
</style>
