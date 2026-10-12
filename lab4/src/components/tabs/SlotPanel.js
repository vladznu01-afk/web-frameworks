import { defineComponent } from 'vue'
// A component boundary lets KeepAlive cache slot content instead of a Fragment.
export default defineComponent({
 name: 'SlotPanel',
 props: { isActive: Boolean },
 setup(props, { slots }) { return () => slots.default?.({ isActive: props.isActive }) },
})
