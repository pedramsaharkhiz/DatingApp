namespace API.Entities
{
    public class Connection
    {
         public Connection(string connectionId, string username) 
        {
            this.ConnectionId = connectionId;
                this.Username = username;
               
        }
        public Connection()
        {
            
        }
        public string ConnectionId {get;set;}
        public string Username { get; set; }

    }
       
        }