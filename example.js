import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import gql from 'graphql-tag';

const client = new ApolloClient({
  link: new HttpLink({ uri: 'http://localhost:4000/graphql' }),
  cache: new InMemoryCache()
});

const queries = {
  listUsers:  gql`query {
    users {
      id
      firstName
      age
      company {
        name
      }
    }
  }`
};

const mutations = {
  addUser: gql`mutation ($firstName: String!, $age: Int!, $companyId: String){
    addUser(firstName: $firstName, age: $age, companyId: $companyId) {
      id
    }
  }`,
  deleteUser: gql`mutation ($id: String!){
    deleteUser(id: $id) {
      id
    }
  }`
};

const fn = {
  showResult (users) {
    const template = document.querySelector('#showUsers'),
    buttonDelete = template.content.querySelectorAll("button"),
    td = template.content.querySelectorAll("td"),
    tb = document.querySelector("tbody");
    tb.innerHTML = '';
    for (let user of users){
      buttonDelete[0].id = user.id;
      td[0].textContent = user.id;
      td[1].textContent = user.firstName;
      td[2].textContent = user.age;
      td[3].textContent = user.company.name;
    
      const clone = document.importNode(template.content, true);
      tb.appendChild(clone);
    }
    fn.putEventDelete();
  },
  putEventDelete () {
    const deleteButtons = document.getElementsByClassName('js-delete');
    for (let element of deleteButtons){
      element.addEventListener('click', fn.deleteUser);
    };
  },
  cleanInputs () {
    document.getElementById('firstName').value = '';
    document.getElementById('age').value = '';
    document.getElementById('companyId').value = '';
  },
  addUser () {
    const firstName = document.getElementById('firstName').value;
    const age = parseInt(document.getElementById('age').value, 10);
    const companyId = document.getElementById('companyId').value;
    client.mutate({ mutation: mutations.addUser, variables: { firstName, age, companyId } })
      .then(({data}) => console.log(data.addUser))
      .catch(error => console.error(error));
    fn.cleanInputs();
  },
  deleteUser () {
    client.mutate({ mutation: mutations.deleteUser, variables: { id: event.target.id } })
    .then(({data}) => console.log(data.deleteUser))
    .catch(error => console.error(error));
  }
}

const observableQuery = client.watchQuery({ query: queries.listUsers, pollInterval: 1000 });

observableQuery.subscribe({
  next: ({ data }) => fn.showResult(data.users),
});


document.getElementById('addUser').addEventListener('click', fn.addUser);
