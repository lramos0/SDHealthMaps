import requests
import logging
from gmaps import json_res
import json

logger = logging.getLogger()
logger.setLevel(logging.INFO)
logger.addHandler(logging.StreamHandler())


# This should eventually be moved into some secrets manager
api_key = "3fd8ab69d84b8aa4867d19ee863c7d606cb030af0adc5facef5f31bca862b8a6"


def construct_serpapi_uri():
    return "https://serpapi.com/search.json"




def query_serpapi():
    uri = construct_serpapi_uri()


    payload = \
        {
            'engine': 'google_maps',
            'api_key': api_key,
            'type': "search",
            'q': 'Hospital san diego'
        }


    response = requests.get(uri, json=payload)


    if response.status_code == 200:
        json = response.json()
        return json
    else:
        logger.error('unable to query serpapi')
        return


def convert_to_geojson(input_json):
    geojson = {
        "type": "FeatureCollection",
        "features": []
    }

    local_results = input_json.get("local_results", [])

    for result in local_results:
        feature = {
            "type": "Feature",
            "properties": {
                "title": result.get("title"),
                "address": result.get("address"),
                "rating": result.get("rating"),
                "reviews": result.get("reviews"),
                "phone": result.get("phone"),
                "website": result.get("website"),
                "type": result.get("type"),
                "types": result.get("types"),
                "open_state": result.get("open_state"),
                "operating_hours": result.get("operating_hours"),
                "user_review": result.get("user_review"),
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    result["gps_coordinates"]["longitude"],
                    result["gps_coordinates"]["latitude"]
                ]
            }
        }
        geojson["features"].append(feature)

    return geojson


def main():
    # TODO: Query data sources and reduce to a single GEO JSON
    serpapi_result=json_res

    aggregate = convert_to_geojson(serpapi_result)
    return aggregate


if __name__ == '__main__':
    print("starting scraping script")
    print(main())
    print("done!")


"""
{
  "type": "Feature",
  "geometry": {
    "type": "Point",
    "coordinates": [125.6, 10.1]
  },
  "properties": {
    "name": "Dinagat Islands"
  }
}
"""