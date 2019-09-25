<template>
  <transition name="modal">
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container">
          <div class="modal-header">
            <slot name="header">
            </slot>
          </div>
          <div class="modal-body">
            <slot name="body">
              <p class="helper py-2">
                Do not leak your key-pair especially your private key to anyone. <br />
                Neither the web nor chain stored your private key. <br />
                Your can't retrieve your private key if you lost except you have key-store file. <br />
                Save your key-pair in security place.
              </p>
            </slot>
          </div>
          <div class="modal-footer">
            <slot name="footer">
              <button class="btn btn-primary" @click="$emit('close')">I Know The Risk</button>
            </slot>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>
<style lang="scss" scoped>
  @import "../../static/scss/common";
  .modal-mask {
    position: fixed;
    z-index: 9998;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, .5);
    display: table;
    transition: opacity .3s ease;
  }
  .modal-wrapper {
    display: table-cell;
    vertical-align: middle;
  }
  .modal-container {
    position: relative;
    width: 400px;
    height: 320px;
    margin: 0 auto;
    transition: all .3s ease;
  }
  .modal-header{
    display: block;
    background-color: #ffffff;
    text-align: center;
    position: relative;
    font-size: 24px;
    color: #333333;
    font-weight: bold;
    border: none;
    padding-top: 29px;
    padding-bottom: 18px;
  }
  .modal-body {
    background-color: #ffffff;
    text-align: center;
  }
  .modal-footer {
    background-color: #ffffff;
    border: none;
  }
  .modal-enter {
    opacity: 0;
  }
  .modal-leave-active {
    opacity: 0;
  }
  .modal-enter .modal-container,
  .modal-leave-active .modal-container {
    -webkit-transform: scale(1.1);
    transform: scale(1.1);
  }
</style>
