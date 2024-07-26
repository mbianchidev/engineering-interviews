# You are given a starting city and an unordered list of trips for a customer, 
# you are tasked with creating an itinerary for that customer. 
# Trips are presented as pairs consisting of start and destination city names. 
#
# All cities must be used to produce the itinerary. 
# If this is not possible return null.

def find_itinerary(start_city, trips):
    # Create a graph representation
    graph = {}
    for trip in trips:
        start, end = trip
        if start not in graph:
            graph[start] = []
        graph[start].append(end)

    # Initialize the itinerary with the starting city
    itinerary = [start_city]

    # Helper function for DFS
    def dfs(city):
        nonlocal itinerary
        if city in graph:
            neighbors = sorted(graph[city])
            for neighbor in neighbors:
                graph[city].remove(neighbor)
                itinerary.append(neighbor)
                dfs(neighbor)
            return True
        return False

    # Perform DFS starting from the given city
    if dfs(start_city) and len(itinerary) == len(trips) + 1:
        return itinerary
    else:
        return None


# Example usage
start_city_1 = "Barcelona"
trips_1 = [["Berlin", "Milan"], ["London", "Milan"], 
           ["Berlin", "Paris"], ["Barcelona", "London"]]
result_1 = find_itinerary(start_city_1, trips_1)
print(result_1)

start_city_2 = "Barcelona"
trips_2 = [["Berlin", "Milan"], ["London", "Milan"], ["Berlin", "Paris"], 
           ["Barcelona", "London"], ["London", "Berlin"]]
result_2 = find_itinerary(start_city_2, trips_2)
print(result_2)

# Version 2


def create_itinerary(start_city, trips):
    itinerary = [start_city]

    while trips:
        found = False
        for i in range(len(trips)):
            if trips[i][0] == itinerary[-1]:
                itinerary.append(trips[i][1])
                trips.pop(i)
                found = True
                break
            elif trips[i][1] == itinerary[0]:
                itinerary.insert(0, trips[i][0])
                trips.pop(i)
                found = True
                break

        if not found:
            return None

    return itinerary


# Example usage:
start_city = "A"
trips = [("A", "B"), ("C", "D"), ("F", "E"),
         ("E", "D"), ("D", "F"), ("B", "C")]

result = create_itinerary(start_city, trips)
print(result)


# Version 3

def create_itinerary(start_city, trips):
    # Create a list to store the itinerary
    itinerary = [start_city]
    # Create a list to store visited cities
    visited_cities = [start_city]
    # Iterate through the trips to create the itinerary
    while trips:
        current_city = itinerary[-1]
        found_trip = False
        for trip in trips:
            if trip[0] == current_city:
                itinerary.append(trip[1])
                visited_cities.append(trip[1])
                trips.remove(trip)
                found_trip = True
                break
            elif trip[1] == current_city:
                # If the destination city is the current city
                # add the start city to the itinerary
                itinerary.append(trip[0])
                visited_cities.append(trip[0])
                trips.remove(trip)
                found_trip = True
                break

        # If no trip is found, return null as
        # it's not possible to create a valid itinerary
        if not found_trip:
            return None

    # Check if all cities have been visited
    if set(visited_cities) == set(city for trip in trips for city in trip):
        return itinerary
    else:
        return None


# Example usage
starting_city = "A"
customer_trips = [("A", "B"), ("B", "C"), ("C", "D"), ("D", "A")]

result = create_itinerary(starting_city, customer_trips)
print(result)
