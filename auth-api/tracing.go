package main

// Todo el archivo tracing.go ha sido comentado para deshabilitar la funcionalidad de Zipkin
/*
import (
	"net/http"

	zipkin "github.com/openzipkin/zipkin-go"
	zipkinhttp "github.com/openzipkin/zipkin-go/middleware/http"
	zipkinhttpreporter "github.com/openzipkin/zipkin-go/reporter/http"
)
*/

import (
	"net/http"
)

// Definición de tipo para mantener la interfaz
type TracedClient struct{}

// Función stub para mantener la compatibilidad
func (c *TracedClient) Do(req *http.Request) (*http.Response, error) {
	// Crear un cliente HTTP estándar para usar en lugar del cliente Zipkin
	client := &http.Client{}
	return client.Do(req)
}

// Función stub que retorna funciones nulas
func initTracing(zipkinURL string) (func(http.Handler) http.Handler, *TracedClient, error) {
	// Retornar una función middleware que no hace nada y un cliente de rastreo vacío
	noopMiddleware := func(handler http.Handler) http.Handler {
		return handler
	}
	return noopMiddleware, &TracedClient{}, nil
}
