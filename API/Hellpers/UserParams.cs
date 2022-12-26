using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Hellpers
{
    public class UserParams : PaginationParams
    {
       
       
        public string CurrentUsername { get; set; }
        public string Gender { get; set; }
        public int MinAge { get; set; } =18;
        public int MaxAge { get; set; } =150;
        public string orderBy { get; set; } = "lastActive";
    }
}