

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000"


/**
 * Core fetch wrapper
 */

export const fetchwithAuth = async (url , options = {} ) => {
  
  const fullUrl = url.startwith("http") ? url 
  : `${BASE_URL}${url.startwith("/") ? "" : "/"}${url}`


const response = await fetch(fullUrl, {
  ...options,
  headers:{
    "Content-Type" : "application/json",
    ...(options.headers || {}),
  },
  credentials: "include", // include cookies
});


//handle auth error 

if(response === 401){
  window.location.herf = "/login"
  throw new Error("Unauthorized. Redirecting to login.")

}

if(!response.ok){
  const errorData = await response.json()
  throw new Error(errorData.message || "API request failed")
}

if(response.status === 204) return null;

return response.json();


}

export const get = (url) => fetchwithAuth (url) 


export const post = async (url, body) => {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    credentials: "include", // for cookies if needed
  });

  const data = await response.json();

  if (!response.ok) {
    // throw proper object that registerUser can understand
    throw { status: response.status, data };
  }

  return data;
};

export const put = (url, data) => fetchwithAuth (url, {
  method: "PUT",
  body: JSON.stringify(data),
})

export const del = (url) => fetchwithAuth (url, {
  method: "DELETE",
})