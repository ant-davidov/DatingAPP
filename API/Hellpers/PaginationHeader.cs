using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Hellpers
{
    public class PaginationHeader
    {
        public PaginationHeader(int currentPage, int itemsPage, int totalItems, int totalPages)
        {
            CurrentPage = currentPage;
            ItemsPerPage = itemsPage;
            TotalItems = totalItems;
            TotalPages = totalPages;
        }

        public  int CurrentPage { get; set; }
        public int ItemsPerPage { get; set; }
        public int TotalItems { get; set; }
        public int TotalPages { get; set; }
    }
}