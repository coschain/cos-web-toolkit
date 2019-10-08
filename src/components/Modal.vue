<template>
  <transition name="modal">
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container">
          <div class="modal-box">
            <div class="modal-header">
              <slot name="header">
              </slot>
            </div>
            <div class="modal-body">
              <slot name="body">
              </slot>
            </div>
            <div class="modal-footer">
              <slot name="footer">
              </slot>
            </div>
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
    width: 400px;
    border-radius: 8px;
    margin: 0 auto;
    transition: all .3s ease;
    background: #FFFFFF;
    box-shadow: 0 0 44px 0 rgba(28,28,28,0.11);
  }
  .modal-box {
    position: relative;
    padding: 48px 20px 30px 20px;
    border-radius: 8px;
    margin: auto;
    background-color: #ffffff;
  }
  .modal-header{
    display: block;
    text-align: center;
    font-size: 24px;
    color: #333333;
    padding: 0;
    font-weight: bold;
    border: none;
    margin-bottom: 18px;
  }
  .modal-body {
    text-align: center;
    font-size: 16px;
    color: #333333;
    padding: 0;
    letter-spacing: 0;
    line-height: 30px;
    margin-bottom: 30px;
  }
  .modal-footer {
    border: none;
    padding: 0;
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
