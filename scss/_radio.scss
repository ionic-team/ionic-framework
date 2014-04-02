
/**
 * Radio Button Inputs
 * --------------------------------------------------
 */

.item-radio {
  padding: 0;

  &:hover {
    cursor: pointer;
  }
}

.item-radio .item-content {
  /* give some room to the right for the checkmark icon */
  padding-right: $item-padding * 4;
}

.item-radio .radio-icon {
  /* checkmark icon will be hidden by default */
  position: absolute;
  top: 0;
  right: 0;
  z-index: $z-index-item-radio;
  visibility: hidden;
  padding: $item-padding - 2;
  height: 100%;
  font-size: 24px;
}

.item-radio input {
  /* hide any radio button inputs elements (the ugly circles) */
  position: absolute;
  left: -9999px;

  &:checked ~ .item-content {
    /* style the item content when its checked */
    background: #f7f7f7;
  }

  &:checked ~ .radio-icon {
    /* show the checkmark icon when its checked */
    visibility: visible;
  }
}

// Hack for Android to correctly display the checked item
// http://timpietrusky.com/advanced-checkbox-hack
.platform-android.grade-b .item-radio,
.platform-android.grade-c .item-radio {
  -webkit-animation: androidCheckedbugfix infinite 1s;
}
@-webkit-keyframes androidCheckedbugfix {
  from { padding: 0; }
  to { padding: 0; }
}
