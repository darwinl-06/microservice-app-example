// Todo el archivo zipkin.js ha sido comentado para deshabilitar la funcionalidad de Zipkin
/*
import {
  Tracer,
  BatchRecorder,
  ExplicitContext,
  jsonEncoder
} from 'zipkin'
import {HttpLogger} from 'zipkin-transport-http'
import {zipkinInterceptor} from 'zipkin-instrumentation-vue-resource'
const ZIPKIN_URL = window.location.protocol + '//' + window.location.host + '/zipkin'
const PUBLIC_ZIPKIN_URL = ZIPKIN_URL.includes('.internal.')
  ? ZIPKIN_URL.replace('.internal.', '.')
  : ZIPKIN_URL

export default {

  install (Vue, options) {
    const serviceName = 'frontend'
    const tracer = new Tracer({
      ctxImpl: new ExplicitContext(),
      recorder: new BatchRecorder({
        logger: new HttpLogger({
          endpoint: ZIPKIN_URL,
          jsonEncoder: jsonEncoder.JSON_V2
        })
      }),
      localServiceName: serviceName
    })

    const interceptor = zipkinInterceptor({tracer, serviceName})
    Vue.http.interceptors.push(interceptor)
  }
}
*/

// Se mantiene un objeto vacío para evitar errores de importación
export default {
  install (Vue, options) {
    // La funcionalidad de Zipkin ha sido deshabilitada
  }
}
