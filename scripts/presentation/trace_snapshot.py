"""Keep full captures local; expose only the fields the presentation uses."""
import copy
from urllib.parse import urlsplit

LEGACY_KEY = 'process.environment_variable.LEGACY_PRICING_URL'
LEGACY_URL = 'http://192.0.2.42:8080/price'
SERVICES = {'gateway','checkout','inventory','cart','catalog','recommendations',
    'promotions','tax','currency','shipping','warehouse','stock-planner','payments',
    'fraud','customer-profile','loyalty','notifications','receipts','postgres','redis'}

def public_snapshot(trace):
    result = copy.deepcopy(trace)
    for batch in result['batches']:
        resource = batch['resource']
        kept = []
        for attribute in resource.get('attributes', []):
            key = attribute['key']; value = attribute['value'].get('stringValue')
            if key == 'service.name':
                assert value in SERVICES, 'Unexpected service in demo evidence'
            elif key in {'service.namespace','k8s.namespace.name'}:
                assert value == 'demo-apps'
            elif key in {'telemetry.sdk.language','telemetry.sdk.name','telemetry.sdk.version',
                         'telemetry.distro.name','telemetry.distro.version','otel.scope.name'}:
                pass
            elif key == LEGACY_KEY:
                assert value == LEGACY_URL, 'Only the requested demo setting is public'
            else:
                continue
            kept.append(attribute)
        resource['attributes'] = kept
        for group in batch['scopeSpans']:
            for span in group['spans']:
                kept = []
                for attribute in span.get('attributes', []):
                    key = attribute['key']; value = attribute['value'].get('stringValue')
                    if key == 'url.full':
                        url = urlsplit(value)
                        assert url.hostname in SERVICES | {'192.0.2.42','127.0.0.1','localhost'}
                        assert not url.username and not url.password and not url.query and not url.fragment
                    elif key not in {'error.type','http.request.method','http.response.status_code','http.method','http.status_code'}:
                        continue
                    kept.append(attribute)
                span['attributes'] = kept
                for event in span.get('events', []):
                    event['attributes'] = [a for a in event.get('attributes', [])
                        if a['key'] in {'exception.type','exception.message'}]
    return result
